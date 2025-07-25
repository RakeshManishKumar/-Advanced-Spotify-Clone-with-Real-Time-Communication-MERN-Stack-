# Troubleshooting: Users Not Saving to MongoDB

## Common Issues and Solutions

### 1. **MongoDB Connection Issues**

**Check if MongoDB is running:**
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl status mongod
```

**Verify your .env file:**
```env
MONGODB_URI=mongodb://localhost:27017/music_app
PORT=3000
```

### 2. **Backend Server Issues**

**Check if backend is running:**
```bash
cd backend
npm run dev
```

**Look for these console messages:**
- ✅ "Connected to mongoDB"
- ✅ "Server is running at: http://localhost:3000"

### 3. **Environment Variables**

**Make sure you have a .env file in the backend directory:**
```env
MONGODB_URI=mongodb://localhost:27017/music_app
PORT=3000
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### 4. **Debug Steps**

**Step 1: Test Database Connection**
```bash
node debug-auth.js
```

**Step 2: Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try signing in
4. Look for any error messages

**Step 3: Check Backend Console**
1. Look at your backend terminal
2. You should see logs like:
   - "Auth route accessed: POST /sync-user"
   - "Auth callback received: {id: '...', firstName: '...', ...}"
   - "Creating new user with clerkId: ..."

### 5. **Common Error Messages**

**"MongoDB connection string is not defined"**
- Solution: Create/check your .env file

**"ECONNREFUSED"**
- Solution: Start MongoDB service

**"Missing required field: id"**
- Solution: Check if Clerk is properly configured

**"Unauthorized"**
- Solution: Check if auth routes are properly configured

### 6. **Testing the Flow**

**Manual Test:**
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser to `http://localhost:5173`
4. Click "Continue with Google"
5. Complete Google sign-in
6. Check backend console for logs
7. Check MongoDB for new user

**Database Check:**
```bash
# Connect to MongoDB
mongosh

# Switch to your database
use music_app

# Check for users
db.users.find()
```

### 7. **Advanced Debugging**

**Add more logging to auth controller:**
The auth controller now includes detailed logging. Check your backend console for:
- Request body data
- User creation attempts
- Database operation results

**Check Network Tab:**
1. Open browser developer tools
2. Go to Network tab
3. Try signing in
4. Look for the `/auth/sync-user` request
5. Check request/response data

### 8. **Reset and Retry**

**If nothing works:**
1. Stop both frontend and backend
2. Clear browser cache and cookies
3. Restart MongoDB
4. Restart backend: `npm run dev`
5. Restart frontend: `npm run dev`
6. Try signing in again

### 9. **Verify Clerk Configuration**

**Check your Clerk dashboard:**
1. Go to https://dashboard.clerk.com/
2. Verify your application is set up
3. Check that Google OAuth is enabled
4. Verify your API keys are correct

**Test Clerk keys:**
```bash
# Test with curl
curl -X POST http://localhost:3000/api/auth/sync-user \
  -H "Content-Type: application/json" \
  -d '{"id":"test123","firstName":"Test","lastName":"User","imageUrl":"https://example.com"}'
```

### 10. **Still Having Issues?**

**Check these files:**
- `backend/.env` - Environment variables
- `backend/src/lib/db.js` - Database connection
- `backend/src/controller/auth.controller.js` - User creation logic
- `frontend/src/pages/auth-callback/AuthCallBack.tsx` - Frontend sync

**Common Solutions:**
1. MongoDB not running → Start MongoDB service
2. Wrong connection string → Check MONGODB_URI in .env
3. Clerk keys missing → Add Clerk keys to .env
4. CORS issues → Check CORS configuration
5. Network issues → Check if backend is accessible at localhost:3000 