# Production-Ready Authentication Implementation

## Overview

This project now uses **httpOnly cookies** for authentication instead of localStorage, providing enterprise-grade security against XSS attacks.

## Security Features

### 🔒 httpOnly Cookies

- **XSS Protection**: Tokens cannot be accessed by JavaScript
- **Automatic Management**: Browser handles cookie storage and transmission
- **Secure Flag**: HTTPS-only in production
- **SameSite Protection**: CSRF attack prevention

### 🛡️ CORS Configuration

- Credentials enabled for cross-origin cookie handling
- Restricted to frontend origin only
- No wildcard origins in production

### 🔑 Token Management

- **Access Token**: 15 minutes expiry (short-lived)
- **Refresh Token**: 30 days expiry (long-lived)
- Both stored as httpOnly cookies
- Automatic refresh mechanism available

## Frontend Changes

### Files Modified

1. **src/components/forms/LoginForm.tsx**
   - Removed all localStorage token handling
   - Added `credentials: include` to fetch requests
   - Uses new API utility functions
   - Stores only user data (non-sensitive) in localStorage

2. **src/app/auth/callback/page.tsx**
   - Changed from reading tokens in URL to success flag
   - No token manipulation on client side
   - Cookies already set by backend redirect

3. **src/lib/api.ts** (NEW)
   - Centralized API request functions
   - Automatic credential inclusion
   - Error handling
   - Logout utility

### How to Use the API Utility

```typescript
import { apiGet, apiPost, apiPut, apiDelete, logout } from "@/lib/api";

// GET request
const userData = await apiGet("/api/users/me");

// POST request
const result = await apiPost("/api/posts", { title: "Hello" });

// PUT request
await apiPut("/api/users/profile", { displayName: "John" });

// DELETE request
await apiDelete("/api/posts/123");

// Logout
await logout();
```

All requests automatically include cookies (credentials).

## Backend Changes Required

See `BACKEND_UPDATES.md` for complete backend implementation guide.

### Summary of Backend Changes:

1. ✅ Install `@fastify/cookie` and `@fastify/cors`
2. ✅ Configure CORS with `credentials: true`
3. ✅ Register cookie plugin
4. ✅ Update login route to set cookies
5. ✅ Update OAuth callback to set cookies
6. ✅ Update logout to clear cookies
7. ✅ Update refresh token route to use cookies

## Authentication Flow

### Email/Password Login

```
User → Frontend (LoginForm)
  ↓ POST /api/auth/login with credentials
Backend
  ↓ Validates credentials
  ↓ Generates tokens
  ↓ Sets httpOnly cookies (accessToken, refreshToken)
  ↓ Returns user data (no tokens)
Frontend
  ↓ Stores user data in localStorage
  ↓ Redirects to dashboard
```

### Google OAuth Login

```
User → Frontend (LoginForm)
  ↓ Redirects to /api/auth/login/google
Backend
  ↓ Redirects to Google OAuth
Google
  ↓ User authenticates
  ↓ Redirects back to backend callback
Backend
  ↓ Validates OAuth token
  ↓ Creates/finds user
  ↓ Generates JWT tokens
  ↓ Sets httpOnly cookies
  ↓ Redirects to /auth/callback?success=true
Frontend
  ↓ Sees success flag
  ↓ Redirects to dashboard
```

### Making Authenticated Requests

```
Frontend
  ↓ Makes request with credentials: include
Browser
  ↓ Automatically attaches cookies
Backend
  ↓ Reads tokens from cookies
  ↓ Validates JWT
  ↓ Returns protected data
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env)

```env
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d
NODE_ENV=development
```

## Cookie Configuration

### Development

```javascript
{
  httpOnly: true,
  secure: false,        // Allow HTTP
  sameSite: 'lax',      // Relaxed for development
  path: '/',
  maxAge: 900           // 15 minutes for access token
}
```

### Production

```javascript
{
  httpOnly: true,
  secure: true,         // HTTPS only
  sameSite: 'strict',   // Strict CSRF protection
  path: '/',
  maxAge: 900
}
```

## Testing

### 1. Email/Password Login

```bash
# Start backend
cd /home/alex/code/basic/basic-back
npm run dev

# Start frontend
cd /home/alex/code/basic/basic-front
npm run dev

# Open browser
http://localhost:3000/auth/login

# Check DevTools → Application → Cookies
# Should see: accessToken and refreshToken
```

### 2. Google OAuth Login

```bash
# Click "Login with Google"
# Complete Google authentication
# Check DevTools → Application → Cookies
# Should see: accessToken and refreshToken
```

### 3. Verify Cookie Properties

In DevTools → Application → Cookies:

- ✅ HttpOnly: Yes
- ✅ Secure: Yes (production only)
- ✅ SameSite: Strict/Lax
- ✅ Path: /
- ✅ Expires: Correct date

## Security Checklist

- [x] Tokens stored in httpOnly cookies
- [x] No tokens in localStorage
- [x] No tokens in URL parameters (OAuth uses success flag)
- [x] CORS configured with credentials
- [x] Secure flag enabled in production
- [x] SameSite protection enabled
- [x] Short access token expiry (15m)
- [x] Refresh token mechanism
- [x] Logout clears cookies
- [x] No sensitive data in client-side storage

## Common Issues & Solutions

### Issue: Cookies not being set

**Solution**: Ensure CORS is configured with `credentials: true` and frontend uses `credentials: 'include'`

### Issue: Cookies not sent with requests

**Solution**: Check that all fetch requests include `credentials: 'include'`

### Issue: CORS errors

**Solution**: Verify `FRONTEND_URL` in backend matches actual frontend URL (including port)

### Issue: Cookies work in development but not production

**Solution**: Ensure backend and frontend use same domain or proper subdomain setup with HTTPS

## Migration from localStorage

If you have existing users with tokens in localStorage:

1. **Client-side**: Create a migration script to clear old tokens

```typescript
// Run once on app load
if (localStorage.getItem("accessToken")) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authToken");
  console.log("Migrated from localStorage to cookies");
}
```

2. **Users will need to login again** after migration

## Future Enhancements

- [ ] Automatic token refresh before expiry
- [ ] Session management UI
- [ ] "Remember me" functionality
- [ ] Multi-device session management
- [ ] Rate limiting on auth endpoints
- [ ] 2FA support
- [ ] Suspicious activity detection

## Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [HTTP Cookie Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
