# Testing Guide - Receiver Decline & Notifications

## Quick Test Scenarios

### Scenario 1: Receiver Declines Accepted Donation

**Setup:**
1. Login as Donor (User A)
2. Create a new donation
3. Login as Receiver (User B) in another browser/tab
4. Request the donation
5. Switch back to Donor (User A)
6. Accept User B's request

**Test Steps:**
1. Switch to Receiver (User B)
2. Navigate to "My Requests" page
3. You should see the donation in "Accepted - Confirm Receipt" section
4. Click "Decline Donation" button
5. ✅ Verify: Success toast appears: "Donation declined. It is now available for others."
6. ✅ Verify: Donation disappears from your requests
7. Switch to Donor (User A)
8. ✅ Verify: Real-time notification appears: "{Receiver} has declined your donation '{Food Name}'"
9. ✅ Verify: Donation status is back to "Available" or "Requested"

### Scenario 2: Multiple Receivers - One Accepted, Others Declined

**Setup:**
1. Login as Donor (User A)
2. Create a new donation
3. Login as Receiver 1 (User B) - Request donation
4. Login as Receiver 2 (User C) - Request donation
5. Login as Receiver 3 (User D) - Request donation

**Test Steps:**
1. Switch to Donor (User A)
2. Accept Receiver 1's request
3. ✅ Verify Receiver 1: Gets "request_accepted" notification
4. ✅ Verify Receiver 2 & 3: Get "request_declined" notifications
5. Switch to Receiver 1 (User B)
6. Decline the donation
7. ✅ Verify: Donation status becomes "Requested" (since User C and D had pending requests)
8. ✅ Verify Donor: Gets "donation_declined" notification

### Scenario 3: Real-time Notification Flow

**Test All Notifications:**

1. **New Request Notification**
   - Receiver requests donation
   - ✅ Donor receives: "{Receiver} has requested your donation"

2. **Request Accepted Notification**
   - Donor accepts request
   - ✅ Receiver receives: "Your request for '{Food}' has been accepted!"

3. **Request Declined Notification**
   - Donor declines request
   - ✅ Receiver receives: "Your request for '{Food}' was declined"

4. **Donation Confirmed Notification**
   - Receiver clicks "I'll Pick It Up"
   - ✅ Donor receives: "{Receiver} confirmed your donation and will pick it up"

5. **Donation Confirmed with Volunteer**
   - Receiver clicks "Request Volunteer"
   - ✅ Donor receives: "{Receiver} confirmed your donation and requested a volunteer"

6. **Donation Declined Notification**
   - Receiver declines accepted donation
   - ✅ Donor receives: "{Receiver} has declined your donation"

### Scenario 4: Status Transitions

**Test 1: Decline with Other Pending Requests**
- Initial: 3 pending requests
- Donor accepts 1 request → Status: "Donor Accepted"
- Accepted receiver declines → Status: "Requested" (2 pending remain)
- ✅ Verify: Other receivers can still be accepted

**Test 2: Decline with No Other Requests**
- Initial: 1 pending request
- Donor accepts the request → Status: "Donor Accepted"
- Receiver declines → Status: "Available"
- ✅ Verify: Donation is available for new requests

## API Testing with Postman/cURL

### 1. Decline Donation (Receiver)

```bash
PATCH http://localhost:5000/api/donations/{donationId}/decline
Authorization: Bearer {receiver_token}
Content-Type: application/json

{}
```

**Expected Response:**
```json
{
  "_id": "...",
  "status": "Available" or "Requested",
  "acceptedReceiver": null,
  "requests": [
    {
      "_id": "...",
      "receiver": "...",
      "status": "Declined",
      ...
    }
  ],
  ...
}
```

### 2. Verify Socket Connection

**Browser Console:**
```javascript
// Check if socket is connected
// Open browser console on any page after login
// Socket connection logs should appear:
// ✅ Socket connected: {socket_id}
// User {userId} joined their room
```

## UI Testing Checklist

### My Requests Page (Receiver)

**Accepted Section:**
- [ ] Shows donation details (food name, quantity, donor)
- [ ] Shows "Accepted" status badge (green)
- [ ] Shows green info box with confirmation message
- [ ] Shows two confirm buttons: "I'll Pick It Up" and "Request Volunteer"
- [ ] Shows red "Decline Donation" button below confirm buttons
- [ ] Decline button is full-width and clearly visible

**After Decline:**
- [ ] Success toast appears
- [ ] Donation removed from accepted section
- [ ] Page refreshes automatically
- [ ] Donor receives real-time notification

### My Donations Page (Donor)

**Pending Requests Section:**
- [ ] Shows all pending requests
- [ ] Each request has Accept/Decline buttons
- [ ] After accepting, other requests auto-decline
- [ ] Real-time notification sent to receivers

**Active Donations:**
- [ ] Shows accepted donations
- [ ] Shows receiver information
- [ ] Updates when receiver confirms/declines

## Socket.IO Testing

### Test Socket Events

**Using Browser DevTools:**

1. Open Network tab
2. Filter by "WS" (WebSocket)
3. Look for socket.io connection
4. Monitor messages for events:
   - `new_request`
   - `request_accepted`
   - `request_declined`
   - `donation_confirmed`
   - `donation_declined`

### Test Socket Rooms

**Verify User-Specific Notifications:**
1. Login as User A in Browser 1
2. Login as User B in Browser 2
3. Perform action as User A
4. ✅ Verify: Only User B receives notification (if targeted)
5. ✅ Verify: User A doesn't receive their own action notification

## Error Handling Tests

### 1. Unauthorized Decline
- Try to decline as non-accepted receiver
- ✅ Expected: 403 Forbidden error

### 2. Invalid Status Transition
- Try to decline when status is not "Donor Accepted"
- ✅ Expected: 400 Bad Request error

### 3. Socket Connection Loss
- Disconnect internet
- Perform action
- Reconnect internet
- ✅ Expected: Socket reconnects, notifications may be missed (future: implement retry)

## Performance Testing

### Load Test
1. Create 10 donations
2. Have 5 receivers request each donation
3. Accept/decline requests rapidly
4. ✅ Verify: All notifications delivered
5. ✅ Verify: No socket connection drops
6. ✅ Verify: UI remains responsive

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Common Issues & Solutions

### Issue 1: Notifications Not Appearing
**Solution:**
- Check browser console for socket connection
- Verify user is logged in
- Check if SocketProvider is wrapping the app
- Verify backend Socket.IO is running

### Issue 2: Decline Button Not Working
**Solution:**
- Check if user is the accepted receiver
- Verify donation status is "Donor Accepted"
- Check network tab for API errors
- Verify token is valid

### Issue 3: Socket Disconnects Frequently
**Solution:**
- Check network stability
- Verify CORS settings
- Check if proxy/load balancer supports WebSockets
- Increase socket timeout settings

## Test Data Setup

### Create Test Users

**Donor:**
```
Email: donor@test.com
Password: Test@1234
Role: ngo (or any verified role)
```

**Receiver 1:**
```
Email: receiver1@test.com
Password: Test@1234
Role: ngo
```

**Receiver 2:**
```
Email: receiver2@test.com
Password: Test@1234
Role: school
```

### Sample Donation Data

```json
{
  "foodName": "Fresh Vegetables",
  "quantity": "10 kg",
  "expiration": "2025-10-04T18:00:00Z",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946,
    "address": "Bangalore, India"
  }
}
```

## Automated Testing (Future)

### Unit Tests
- Test `declineDonation` controller function
- Test status transition logic
- Test socket event emission

### Integration Tests
- Test complete decline workflow
- Test notification delivery
- Test multi-user scenarios

### E2E Tests (Playwright/Cypress)
- Test UI interactions
- Test real-time updates
- Test cross-browser compatibility

---

**Happy Testing! 🧪**
