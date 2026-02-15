# 🧭 Navigation Guide - Finding My Requests Page

## ✅ How to Access "My Requests" Page

The "My Requests" page is now accessible from **TWO locations**:

---

## 📍 Location 1: Navigation Bar (Top)

**Always visible at the top of every page:**

```
┌─────────────────────────────────────────────────────────────┐
│  🍔 FoodBridge                                              │
│                                                             │
│  [Dashboard] [Donate] [My Donations] [Receive] [My Requests] [History]
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Steps:**
1. Look at the top navigation bar
2. Click on **"My Requests"** link
3. You'll see all your food requests and confirmations

---

## 📍 Location 2: Dashboard (Quick Actions)

**NEW! Now added to the dashboard for easy access:**

```
Dashboard → Quick Actions Section

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Donate Food │  │ My Donations │  │ Receive Food │  │ My Requests  │
│              │  │              │  │              │  │              │
│   📦         │  │   📦         │  │   ❤️         │  │   ❤️         │
│              │  │              │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
   (Primary)         (Blue)           (Pink)           (Green) ← NEW!
```

**Steps:**
1. Go to Dashboard
2. Scroll to "Quick Actions" section
3. Click the **green "My Requests"** card
4. You'll be taken to your requests page

---

## 🎯 What You'll See on My Requests Page

### When You Have Accepted Requests:

```
┌─────────────────────────────────────────────────────────────┐
│  Accepted - Confirm Receipt                                 │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Fresh Vegetables                        [Accepted]   │ │
│  │  Quantity: 10 kg                                      │ │
│  │  Donor: Restaurant Name                               │ │
│  │                                                       │ │
│  │  ✓ Your request has been accepted!                   │ │
│  │    Please confirm how you'll receive the donation:   │ │
│  │                                                       │ │
│  │    ┌──────────────────┐  ┌──────────────────────┐   │ │
│  │    │ I'll Pick It Up  │  │ Request Volunteer    │   │ │
│  │    └──────────────────┘  └──────────────────────┘   │ │
│  │                                                       │ │
│  │    ┌──────────────────────────────────────────────┐ │ │
│  │    │         Decline Donation                     │ │ │
│  │    └──────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Sections on My Requests Page:

1. **📊 Stats Cards** (Top)
   - Pending requests count
   - Accepted requests count
   - Ongoing donations count
   - Completed donations count

2. **✅ Accepted - Confirm Receipt** (Most Important!)
   - Shows donations where donor accepted your request
   - **3 buttons to choose from:**
     - 🟢 I'll Pick It Up
     - 🔵 Request Volunteer
     - 🔴 Decline Donation

3. **🚚 Ongoing**
   - Donations you're currently receiving
   - Option to mark as received

4. **⏳ Pending Requests**
   - Requests waiting for donor response

5. **✔️ Completed Donations**
   - Past donations you received
   - Option to rate donor

---

## 🔍 Troubleshooting

### Issue: "My Requests" link not visible in navbar

**Check:**
- Are you logged in as a regular user (not admin/volunteer)?
- The link only shows for users with roles: ngo, catering, school, etc.

**Solution:**
```javascript
// Navbar shows "My Requests" for non-admin, non-volunteer users
// If you're admin or volunteer, use the dashboard card instead
```

### Issue: Dashboard card not showing

**Check:**
- Is your account verified?
- Cards are disabled if verification is pending

**Solution:**
1. Check verification status on dashboard
2. Wait for admin to verify your account
3. Once verified, all cards will be enabled

### Issue: Page is empty

**Possible Reasons:**
1. **No requests made yet**
   - Go to "Receive" page
   - Request a donation first

2. **No accepted requests**
   - Wait for donor to accept your request
   - You'll get a notification when accepted

3. **All requests completed**
   - Check "Completed Donations" section at bottom

---

## 📱 Mobile Navigation

On mobile devices:

```
☰ Menu (Hamburger Icon)
  ├── Dashboard
  ├── Donate
  ├── My Donations
  ├── Receive
  ├── My Requests  ← Here!
  └── History
```

---

## 🎬 Step-by-Step First Time Use

### For Receivers:

**Step 1: Request a Donation**
```
1. Click "Receive" in navbar
2. Browse available donations
3. Click "Request" on a donation
4. Wait for donor to accept
```

**Step 2: Get Notification**
```
🔔 "Your request for 'Food Name' has been accepted!"
```

**Step 3: Go to My Requests**
```
Method A: Click "My Requests" in navbar
Method B: Dashboard → Click green "My Requests" card
```

**Step 4: Confirm Receipt**
```
1. See "Accepted - Confirm Receipt" section
2. Choose one of 3 options:
   - I'll Pick It Up (you collect)
   - Request Volunteer (volunteer delivers)
   - Decline Donation (can't accept)
```

---

## 🗺️ Complete Navigation Map

```
FoodBridge Application
│
├── 🏠 Dashboard
│   ├── Stats Overview
│   ├── Quick Actions
│   │   ├── Donate Food → /donate
│   │   ├── My Donations → /my-donations
│   │   ├── Receive Food → /receive
│   │   └── My Requests → /my-requests ✨
│   └── Recent Activity
│
├── 📦 Donate → /donate
│   └── Create new donation
│
├── 📦 My Donations → /my-donations
│   ├── Pending Requests (from receivers)
│   ├── Active Donations
│   └── Completed Donations
│
├── ❤️ Receive → /receive
│   └── Browse & request donations
│
├── ❤️ My Requests → /my-requests ⭐ YOU ARE HERE
│   ├── Accepted - Confirm Receipt
│   ├── Ongoing
│   ├── Pending Requests
│   └── Completed Donations
│
└── 📜 History → /history
    └── All past activities
```

---

## ✅ Quick Access Summary

**Fastest Ways to Access My Requests:**

1. **From Anywhere:**
   - Click "My Requests" in top navbar

2. **From Dashboard:**
   - Click green "My Requests" card

3. **Direct URL:**
   - `http://localhost:5173/my-requests`

---

## 🎯 What to Expect

### First Visit (No Requests):
```
┌─────────────────────────────────────┐
│  My Requests                        │
├─────────────────────────────────────┤
│                                     │
│         ❤️                          │
│    No requests yet                  │
│                                     │
│  Browse available donations and     │
│  make your first request!           │
│                                     │
└─────────────────────────────────────┘
```

### After Donor Accepts:
```
┌─────────────────────────────────────┐
│  Accepted - Confirm Receipt         │
├─────────────────────────────────────┤
│  [Your donation card with 3 buttons]│
│  - I'll Pick It Up                  │
│  - Request Volunteer                │
│  - Decline Donation                 │
└─────────────────────────────────────┘
```

---

**Now you know exactly where to find and how to use the My Requests page! 🚀**
