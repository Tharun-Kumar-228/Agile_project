# Implementation Notes - Receiver Decline & Real-time Notifications

## Overview
This document outlines the implementation of receiver-side decline functionality and real-time notifications for the FoodBridge donation platform.

## Features Implemented

### 1. Receiver Decline Functionality
**Purpose**: Allow receivers to decline an accepted donation, making it available for other receivers.

#### Backend Changes

**File**: `backend/src/controllers/donationController.js`
- **New Function**: `declineDonation`
  - Allows receiver to decline after donor has accepted their request
  - Validates that user is the accepted receiver
  - Marks receiver's request as 'Declined'
  - Removes acceptedReceiver from donation
  - Sets donation status back to:
    - 'Requested' if there are other pending requests
    - 'Available' if no pending requests exist
  - Sends real-time notification to donor

**File**: `backend/src/routes/donationRoutes.js`
- Added route: `PATCH /api/donations/:id/decline`
- Protected with `protect` and `checkVerified` middleware

#### Frontend Changes

**File**: `frontend/src/pages/Receive/MyRequestsPage.jsx`
- **New Function**: `handleDecline(donationId)`
  - Calls the decline API endpoint
  - Shows success toast notification
  - Refreshes the requests list
- **UI Update**: Added "Decline Donation" button in the accepted requests section
  - Positioned below the confirm buttons
  - Styled in red to indicate rejection
  - Full-width button for clear visibility

### 2. Real-time Notifications System

#### Backend Notifications

**File**: `backend/src/controllers/donationController.js`

All donation actions now emit real-time Socket.IO events:

1. **New Request** (`new_request`)
   - Triggered when: Receiver requests a donation
   - Notifies: Donor
   - Message: "{Receiver} has requested your donation '{Food Name}'"

2. **Request Accepted** (`request_accepted`)
   - Triggered when: Donor accepts a request
   - Notifies: Accepted receiver
   - Message: "Your request for '{Food Name}' has been accepted!"

3. **Request Declined** (`request_declined`)
   - Triggered when: Donor declines a request OR accepts another request
   - Notifies: Declined receiver(s)
   - Message: "Your request for '{Food Name}' was declined/not accepted"

4. **Donation Confirmed** (`donation_confirmed`)
   - Triggered when: Receiver confirms donation
   - Notifies: Donor
   - Message: "{Receiver} confirmed your donation '{Food Name}' and will pick it up/requested a volunteer"

5. **Donation Declined** (`donation_declined`)
   - Triggered when: Receiver declines accepted donation
   - Notifies: Donor
   - Message: "{Receiver} has declined your donation '{Food Name}'"

#### Frontend Socket Integration

**File**: `frontend/src/context/SocketContext.jsx` (NEW)
- Created Socket.IO context provider
- Automatically connects when user is authenticated
- Joins user-specific room: `user_{userId}`
- Listens for all notification events
- Displays toast notifications for each event type:
  - Success: Confirmations and acceptances
  - Warning: Declines from receivers
  - Error: Request rejections
  - Info: New requests

**File**: `frontend/src/main.jsx`
- Wrapped app with `SocketProvider`
- Ensures socket connection is available throughout the app

### 3. Documentation Updates

**File**: `README.md`
- Updated donation workflow to include receiver decline option
- Added new API endpoint documentation
- Clarified that declined donations return to pending/available status

## Workflow Changes

### Previous Flow
1. Donor creates donation
2. Receiver requests donation
3. Donor accepts/declines request
4. **Receiver confirms** (only option)
5. Donation proceeds

### New Flow
1. Donor creates donation
2. Receiver requests donation
3. Donor accepts/declines request
4. **Receiver can now**:
   - ✅ Confirm (pick up or request volunteer)
   - ❌ Decline (donation returns to pending/available)
5. Donation proceeds or becomes available again

## Status Transitions

### When Receiver Declines:
- Request status: `Accepted` → `Declined`
- Donation status: `Donor Accepted` → `Requested` (if other pending requests) OR `Available` (if no pending requests)
- AcceptedReceiver: Removed (set to null)

## Real-time Event Flow

```
User Action                 → Socket Event          → Notification Recipient
─────────────────────────────────────────────────────────────────────────────
Receiver requests donation  → new_request          → Donor
Donor accepts request       → request_accepted     → Accepted Receiver
                           → request_declined     → Other Receivers
Donor declines request      → request_declined     → Declined Receiver
Receiver confirms donation  → donation_confirmed   → Donor
Receiver declines donation  → donation_declined    → Donor
```

## Testing Checklist

### Backend Testing
- [ ] Receiver can decline accepted donation
- [ ] Donation status updates correctly after decline
- [ ] Other pending requests remain intact
- [ ] Socket notifications are emitted correctly
- [ ] Authorization checks work properly

### Frontend Testing
- [ ] Decline button appears for accepted requests
- [ ] Decline action updates UI immediately
- [ ] Toast notifications display correctly
- [ ] Socket connection establishes on login
- [ ] Real-time notifications appear for all events

### Integration Testing
- [ ] Donor receives notification when receiver declines
- [ ] Donor receives notification when receiver confirms
- [ ] Receiver receives notification when request is accepted/declined
- [ ] Multiple users can see real-time updates
- [ ] Declined donations become available for others

## Environment Variables

No new environment variables required. Existing Socket.IO configuration uses:
- `CLIENT_URL` - Frontend URL for CORS
- `SERVER_URL` - Backend URL

## Dependencies

### Backend
- `socket.io` - Already installed

### Frontend
- `socket.io-client` - Already installed

## Security Considerations

1. **Authorization**: All endpoints verify user identity and permissions
2. **Socket Rooms**: Users only receive notifications in their specific room
3. **Data Validation**: Request and donation IDs are validated before processing
4. **Status Checks**: Ensures valid status transitions only

## Future Enhancements

1. **Notification History**: Store notifications in database
2. **Push Notifications**: Add browser push notifications
3. **Email Notifications**: Send email for critical events
4. **Notification Preferences**: Allow users to customize notification settings
5. **Read/Unread Status**: Track which notifications have been seen

## Files Modified

### Backend
1. `backend/src/controllers/donationController.js` - Added decline function and socket notifications
2. `backend/src/routes/donationRoutes.js` - Added decline route

### Frontend
1. `frontend/src/pages/Receive/MyRequestsPage.jsx` - Added decline button and handler
2. `frontend/src/context/SocketContext.jsx` - NEW: Socket context provider
3. `frontend/src/main.jsx` - Integrated SocketProvider

### Documentation
1. `README.md` - Updated workflow and API documentation
2. `IMPLEMENTATION_NOTES.md` - NEW: This file

## Deployment Notes

1. Ensure Socket.IO is properly configured in production
2. Update CORS settings for production URLs
3. Test WebSocket connections through load balancers/proxies
4. Monitor socket connection stability
5. Consider using Redis adapter for multi-server deployments

---

**Implementation Date**: 2025-10-03
**Status**: ✅ Complete
