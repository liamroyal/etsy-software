# Test Users Setup Guide

Since we removed public registration, you'll need to manually create test users in Firebase.

## Method 1: Direct Firebase Console (Easiest)

### Step 1: Create Authentication User
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Enter email: `admin@test.com`
4. Enter password: `password123`
5. Click "Add user"

### Step 2: Create Firestore User Document
1. Go to Firebase Console → Firestore Database
2. Click "Start collection" 
3. Collection ID: `users`
4. Document ID: [Use the UID from the user you just created in Authentication]
5. Add these fields:
   ```
   uid: [same UID as authentication user]
   email: admin@test.com
   role: admin
   createdAt: [current timestamp]
   displayName: Admin User (optional)
   ```

## Method 2: Create Multiple Test Users

### Admin User:
- **Email:** `admin@test.com`
- **Password:** `password123`
- **Role:** `admin` (in Firestore document)

### Regular User:
- **Email:** `user@test.com`
- **Password:** `password123`
- **Role:** `user` (in Firestore document)

## Method 3: Temporary Registration Script (Advanced)

If you want to quickly create users programmatically, you can temporarily add this to your app:

```javascript
// Add this as a temporary button in your Home component
const createTestUsers = async () => {
  try {
    // Create admin user
    await register('admin@test.com', 'password123', 'admin');
    // Create regular user  
    await register('user@test.com', 'password123', 'user');
    console.log('Test users created!');
  } catch (error) {
    console.error('Error creating users:', error);
  }
};
```

## Verification Steps

After creating test users:

1. **Test Admin Login:**
   - Email: `admin@test.com`
   - Password: `password123`
   - Should see "ADMIN" role badge
   - Should see "Admin Panel" feature card

2. **Test User Login:**
   - Email: `user@test.com` 
   - Password: `password123`
   - Should see "USER" role badge
   - Should NOT see "Admin Panel" feature card

3. **Check Firestore:**
   - Go to Firebase Console → Firestore
   - You should see a `users` collection
   - Each user document should have proper role assignment

## Next Steps

Once you confirm the app works with test users:
- ✅ Implement admin user management panel
- ✅ Add user creation form for admins
- ✅ Add user editing/role management
- ✅ Add user deactivation functionality

---

**Remember:** Remove any temporary registration buttons after testing! 