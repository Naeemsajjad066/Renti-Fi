# Admin Panel Setup Guide

## Issue Found
Your admin panel wasn't showing pending properties because:
1. ✅ The admin routes weren't registered in `server.js` (FIXED)
2. ✅ The User model didn't have a `role` field (FIXED)
3. ⚠️ Your current user account doesn't have admin privileges (NEEDS SETUP)

## What Was Fixed

### 1. Registered Admin Routes in `server.js`
```javascript
import adminRouter from "./routes/admin.js";
// ...
app.use("/api/admin", adminRouter);
```

### 2. Added Role Fields to User Model
```javascript
role: {
  type: String,
  enum: ['user', 'host', 'admin'],
  default: 'user'
},
isHost: {
  type: Boolean,
  default: false
},
isActive: {
  type: Boolean,
  default: true
}
```

### 3. Created Admin Setup Script
Location: `server/scripts/makeAdmin.js`

## How to Make Your Account Admin

### Step 1: Stop the Server
Press `Ctrl+C` in the terminal where the server is running.

### Step 2: Run the Admin Setup Script
Replace `your-email@example.com` with the email you used to register:

```bash
cd server
node scripts/makeAdmin.js your-email@example.com
```

**Example:**
```bash
node scripts/makeAdmin.js naeem@example.com
```

You should see output like:
```
Connected to MongoDB
✅ Successfully updated Your Name (your-email@example.com) to admin role
User details: {
  name: 'Your Name',
  email: 'your-email@example.com',
  role: 'admin',
  isHost: true
}
```

### Step 3: Restart the Server
```bash
npm start
```

### Step 4: Log Out and Log In Again
1. Go to your app in the browser
2. Log out completely
3. Log in again with your credentials
4. Your new admin role will be in the token

### Step 5: Test the Admin Panel
1. Navigate to the admin panel page
2. You should now see:
   - Dashboard with real statistics
   - Users list
   - **Property Verification tab** with pending properties
   - All your pending properties should appear

## Verification Checklist

After logging back in, verify:

- [ ] Can access admin panel without errors
- [ ] Dashboard shows real statistics (not just zeros)
- [ ] Users tab shows registered users
- [ ] **Property Verification tab shows your pending property**
- [ ] Can click "View Details" on a pending property
- [ ] Can see property images, documents, and location
- [ ] Can approve or reject the property

## How the Verification Flow Works

### When Host Adds a Property:
1. ✅ Host fills out property details (Step 1-4)
2. ✅ Host uploads ID card and property documents (Step 5)
3. ✅ Property is created with `verificationStatus: 'pending'`
4. ✅ Property is hidden from public (`isActive: false`)

### In Admin Panel:
1. ✅ Admin sees property in "Property Verification" tab
2. ✅ Admin can view all details, images, documents, and location
3. ✅ Admin can approve or reject with optional notes

### After Approval:
1. ✅ Property status changes to `approved`
2. ✅ Property becomes visible (`isActive: true`)
3. ✅ Host receives approval email
4. ✅ Property appears in public listings

### After Rejection:
1. ✅ Property status changes to `rejected`
2. ✅ Property stays hidden
3. ✅ Host receives rejection email with reason
4. ✅ Host can resubmit (future feature)

## Troubleshooting

### If pending properties still don't show:
1. Make sure you logged out and back in after running the script
2. Check browser console for errors
3. Check server logs for errors
4. Verify the property was created with verification documents

### If you get "Not authorized as admin" error:
1. Clear browser cache and cookies
2. Log out completely
3. Log in again
4. Check that the makeAdmin script ran successfully

### If you see "0" properties in verification tab:
1. Make sure you submitted a property with ID card and documents
2. Check that the property status is 'pending' in the database
3. Make sure server restarted after adding admin routes

## Database Check (Optional)

To verify your property is in the database with pending status:

```bash
# In MongoDB shell or MongoDB Compass, run:
db.properties.find({ verificationStatus: 'pending' })
```

You should see your property with:
- `verificationStatus: 'pending'`
- `hostIdCard: { url: '...', publicId: '...' }`
- `propertyDocuments: [{ url: '...', name: '...' }]`
- `isActive: false`
- `isVerified: false`

## Next Steps

Once your admin account is set up and working:

1. ✅ Test the full verification workflow
2. ✅ Try approving a property
3. ✅ Verify host receives email
4. ✅ Check that approved property appears in public listings
5. ✅ Try rejecting a property with a reason
6. ✅ Verify host receives rejection email

## Support

If you still have issues after following these steps, provide:
1. Output from the makeAdmin script
2. Browser console errors
3. Server logs
4. Screenshot of the admin panel
