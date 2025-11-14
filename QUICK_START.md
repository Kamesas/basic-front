# Quick Start Guide - httpOnly Cookie Authentication

## 🚀 Apply Backend Changes (5 minutes)

### Step 1: Install Dependencies

```bash
cd /home/alex/code/basic/basic-back
npm install @fastify/cookie @fastify/cors
```

### Step 2: Apply Code Changes

Follow the complete instructions in `BACKEND_UPDATES.md` to update these files:

- ✅ `src/app.ts` - Add CORS and cookie plugins
- ✅ `src/api/auth/auth.routes.ts` - Update login to set cookies
- ✅ `src/api/auth/auth.google.routes.ts` - Update OAuth callback to set cookies
- ✅ `src/api/auth/auth.logout.routes.ts` - Update logout to clear cookies
- ✅ `src/api/auth/auth.tokens.routes.ts` - Update refresh to use cookies

### Step 3: Start Backend

```bash
cd /home/alex/code/basic/basic-back
npm run dev
```

## ✅ Frontend Already Updated!

The frontend has been fully updated and is ready to use:

- ✅ LoginForm uses cookie-based auth
- ✅ OAuth callback handles cookies
- ✅ API utility with credentials support
- ✅ No localStorage token storage

### Start Frontend

```bash
cd /home/alex/code/basic/basic-front
npm run dev
```

## 🧪 Test the Implementation

### Test 1: Email/Password Login

1. Go to http://localhost:3000/auth/login
2. Enter credentials
3. Open DevTools → Application → Cookies
4. Verify `accessToken` and `refreshToken` cookies exist
5. Check HttpOnly flag is enabled

### Test 2: Google OAuth

1. Click "Login with Google"
2. Complete Google authentication
3. Check DevTools → Application → Cookies
4. Verify cookies are set

### Test 3: Console Logs

Watch the browser console for detailed logs:

- 🔐 Login attempts
- ✅ Success messages
- 🔍 OAuth callbacks
- ❌ Error messages

## 📋 What Changed?

### Security Improvements

- **Before**: Tokens in localStorage (vulnerable to XSS)
- **After**: Tokens in httpOnly cookies (XSS protected)

### Frontend Changes

- Removed all localStorage token handling
- Added `credentials: 'include'` to all API requests
- Created reusable API utility functions
- Updated OAuth callback to use success flag

### Backend Changes (see BACKEND_UPDATES.md)

- Added CORS with credentials support
- Set tokens as httpOnly cookies
- OAuth callback sets cookies before redirect
- Logout clears cookies

## 🔍 Verify Implementation

### Check Cookies in DevTools

```
Application → Cookies → http://localhost:3000

Expected cookies:
- accessToken (HttpOnly: ✓, Secure: ✗ in dev, SameSite: Lax)
- refreshToken (HttpOnly: ✓, Secure: ✗ in dev, SameSite: Lax)
```

### Check Network Requests

```
Network → XHR → /api/auth/login

Request Headers:
- Cookie: accessToken=...; refreshToken=...

Response Headers:
- Set-Cookie: accessToken=...; HttpOnly; SameSite=Lax
- Set-Cookie: refreshToken=...; HttpOnly; SameSite=Lax
```

## 🐛 Troubleshooting

### "Cookies not being set"

- Verify backend CORS configuration includes `credentials: true`
- Check frontend requests include `credentials: 'include'`
- Ensure `FRONTEND_URL` environment variable is correct

### "CORS error"

- Backend `FRONTEND_URL` must match frontend URL exactly
- Both must be on same protocol (both HTTP or both HTTPS)
- Check no trailing slash in URLs

### "Login works but protected routes fail"

- Verify all API requests use `credentials: 'include'`
- Use the API utility functions from `src/lib/api.ts`
- Check cookies exist in DevTools

## 📚 Documentation

- **BACKEND_UPDATES.md** - Complete backend implementation guide
- **AUTH_IMPLEMENTATION.md** - Comprehensive authentication documentation
- **src/lib/api.ts** - Frontend API utility functions

## 🎯 Next Steps

1. Apply backend changes following BACKEND_UPDATES.md
2. Test both login methods
3. Implement protected routes using API utilities
4. Add logout functionality
5. Consider adding token refresh logic

## 💡 Using the API Utility

```typescript
import { apiGet, apiPost, logout } from "@/lib/api";

// In your components
const fetchUserData = async () => {
  try {
    const user = await apiGet("/api/users/me");
    console.log(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
};

// Logout
const handleLogout = async () => {
  await logout();
  router.push("/auth/login");
};
```

## ✨ Production Deployment

When deploying to production:

1. Set `NODE_ENV=production` in backend
2. Use HTTPS for both frontend and backend
3. Cookies will automatically use `Secure` flag
4. `SameSite` will be set to `strict`
5. Ensure same root domain or proper CORS setup

---

**Questions?** Check AUTH_IMPLEMENTATION.md for detailed documentation.
