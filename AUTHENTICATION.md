# Authentication Flow

This application uses Clerk for authentication with Google OAuth. Here's how the authentication flow works:

## Authentication States

### When User is NOT Signed In:
- Shows "Continue with Google" button in the top bar
- Displays welcome message asking user to sign in
- Shows sign-in prompt with Google OAuth option

### When User IS Signed In:
- Shows user's name in the top bar
- Displays "Sign Out" button
- Shows "Dashboard" link for navigation
- Displays personalized content

## Components

### TopBar Component
- **Location**: `frontend/src/components/TopBar.tsx`
- **Function**: Main navigation bar that shows different content based on auth state
- **Features**:
  - Shows user info when signed in
  - Displays sign-out button when signed in
  - Shows "Continue with Google" button when signed out
  - Includes dashboard navigation link

### SignInOAuthButton Component
- **Location**: `frontend/src/components/SignInOAuthButton.tsx`
- **Function**: Handles Google OAuth sign-in
- **Features**:
  - Google OAuth integration
  - Error handling
  - Redirects to callback after successful sign-in

### ProtectedRoute Component
- **Location**: `frontend/src/components/ProtectedRoute.tsx`
- **Function**: Wraps routes that require authentication
- **Features**:
  - Redirects unauthenticated users to home page
  - Only renders content for authenticated users

## Routes

### Public Routes
- `/` - Home page (shows different content based on auth state)
- `/sso-callback` - Clerk OAuth callback
- `/auth-callback` - Custom auth callback that syncs user data

### Protected Routes
- `/dashboard` - Example protected route (requires authentication)

## Backend Integration

### Auth Controller
- **Location**: `backend/src/controller/auth.controller.js`
- **Function**: Handles user data synchronization
- **Endpoints**:
  - `/api/auth/sync-user` - Creates/updates user in database
  - `/api/auth/callback` - Alternative callback endpoint

### User Model
- **Location**: `backend/src/models/user.model.js`
- **Function**: Stores user data from Clerk
- **Fields**:
  - `clerkId` - Clerk user ID
  - `fullName` - User's full name
  - `imageUrl` - User's profile image

## Environment Variables

### Frontend (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)
```env
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
MONGODB_URI=mongodb://localhost:27017/music_app
PORT=3000
```

## Usage

1. **Sign In**: Click "Continue with Google" button
2. **Sign Out**: Click "Sign Out" button in top bar
3. **Protected Routes**: Automatically redirect to home if not authenticated
4. **User Data**: Automatically synced to backend database on first sign-in

## Styling

- Uses Tailwind CSS for consistent styling
- Dark theme with zinc/gray color scheme
- Responsive design for mobile and desktop
- Hover effects and transitions for better UX 