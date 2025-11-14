# Backend Updates for httpOnly Cookie Authentication

## Step 1: Install Dependencies

```bash
cd /home/alex/code/basic/basic-back
npm install @fastify/cookie @fastify/cors
```

## Step 2: Update `src/app.ts`

Replace the content with:

```typescript
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import { join } from "node:path";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import usersRoutes from "./api/users/users.routes";
import authRoutes from "./api/auth/auth.routes";
import { config, isProduction } from "./config";

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // CORS configuration for cookie-based auth
  await fastify.register(cors, {
    origin: config.frontendUrl,
    credentials: true,
  });

  // Cookie support
  await fastify.register(cookie, {
    secret: config.jwtSecret,
    parseOptions: {},
  });

  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      },
    },
  });

  // Zod validation
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // Routes
  fastify.register(usersRoutes, { prefix: "/api" });
  fastify.register(authRoutes, { prefix: "/api/auth" });
  // Plugins
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });
};

export default app;
export { app, options };
```

## Step 3: Update `src/api/auth/auth.routes.ts`

Replace the login route (lines 73-117) with:

```typescript
f.post("/login", { schema: loginRouteSchema }, async (request, reply) => {
  const { email, password } = request.body;

  const user = await findUserWithEmailProvider(email);

  if (!user || !user.password_hash) {
    return reply.code(401).send({ message: "Invalid credentials" });
  }

  if (!user.email_verified) {
    return reply.code(403).send({ message: "Verify your email" });
  }

  const isPasswordValid = await argonVerify(password, user.password_hash);
  if (!isPasswordValid) {
    return reply.code(401).send({ message: "Invalid credentials" });
  }

  const tokenData: tJwtPayload = {
    username: user.username,
    email: user.email || undefined,
    userId: user.id,
  };

  const accessToken = generateAccessToken(tokenData);
  const refreshToken = generateRefreshToken(tokenData);

  await storeTokens(
    tokenData.userId,
    refreshToken,
    request.headers["user-agent"],
  );

  // Set httpOnly cookies
  const isProduction = process.env.NODE_ENV === "production";

  reply.setCookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return reply.code(200).send({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.display_name,
      createdAt: user.created_at.toISOString(),
    },
  });
});
```

## Step 4: Update `src/api/auth/auth.google.routes.ts`

Replace the callback route (lines 24-94) with:

```typescript
f.get("/login/google/callback", async (request, reply) => {
  const { token } =
    await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    },
  );

  if (!userInfoResponse.ok) {
    fastify.log.error(
      { statusText: userInfoResponse.statusText },
      "Google API error",
    );
    return reply.code(401).send({
      error: "Failed to fetch user info from Google",
    });
  }

  const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;

  if (!userInfo || !userInfo.email) {
    fastify.log.error({ userInfo }, "Invalid user info received");
    return reply.code(400).send({
      error: "Invalid user information received from Google",
    });
  }

  const existingUser = await findUserByGoogleId(userInfo.id);

  let userId: number;
  let username: string;

  if (!existingUser) {
    const result = await loginOrRegisterWithGoogle({
      googleId: userInfo.id,
      email: userInfo.email,
      displayName: userInfo.name,
      avatarUrl: userInfo.picture,
      providerData: {
        verified_email: userInfo.verified_email,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
        locale: userInfo.locale,
      },
    });

    userId = result.user.id;
    username = result.user.username;
  } else {
    userId = existingUser.id;
    username = existingUser.username;
  }

  const accessToken = generateAccessToken({ userId, username });
  const refreshToken = generateRefreshToken({ userId, username });

  await storeTokens(userId, refreshToken, request.headers["user-agent"]);

  // Set httpOnly cookies
  const isProduction = process.env.NODE_ENV === "production";

  reply.setCookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  const frontendRedirectUrl = new URL("/auth/callback", config.frontendUrl);
  frontendRedirectUrl.searchParams.set("success", "true");

  return reply.redirect(frontendRedirectUrl.toString());
});
```

## Step 5: Update `src/api/auth/auth.logout.routes.ts`

Check the current logout route and ensure it clears cookies:

```typescript
f.post("/logout", async (request, reply) => {
  // Clear cookies
  reply.clearCookie("accessToken", { path: "/" });
  reply.clearCookie("refreshToken", { path: "/" });

  // Your existing logout logic here (remove refresh token from DB, etc.)

  return reply.code(200).send({ message: "Logged out successfully" });
});
```

## Step 6: Update `src/api/auth/auth.tokens.routes.ts`

Update the refresh token route to read from cookies:

```typescript
f.post("/refresh", async (request, reply) => {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    return reply.code(401).send({ message: "Refresh token not found" });
  }

  // Your existing token refresh logic...
  // After generating new tokens, set them as cookies:

  const isProduction = process.env.NODE_ENV === "production";

  reply.setCookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  reply.setCookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return reply.code(200).send({ message: "Tokens refreshed" });
});
```

## Key Changes Summary:

1. **Added CORS** with `credentials: true` to allow cookies in cross-origin requests
2. **Added @fastify/cookie** plugin for cookie support
3. **Changed token delivery**: Tokens now set as httpOnly cookies instead of JSON response
4. **Security flags**:
   - `httpOnly: true` - prevents JavaScript access
   - `secure: true` in production - HTTPS only
   - `sameSite: 'strict'/'lax'` - CSRF protection
5. **OAuth callback**: Now redirects with `?success=true` instead of tokens in URL
6. **Login response**: Returns user data only (no tokens)

## Testing:

After applying these changes:

```bash
cd /home/alex/code/basic/basic-back
npm run dev
```

The backend will now set cookies automatically when users log in!
