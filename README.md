<a href="https://github.com/manolo-in/better-auth-instagram">
    <img width="1584" height="396" alt="cover" src="https://github.com/manolo-in/better-auth-instagram/blob/main/cover.png?raw=true" />
</a>

# better-auth-instagram
Instagram Provider for Better-Auth. Wrapper around [Generic OAuth](https://www.better-auth.com/docs/plugins/generic-oauth) plugin.

This package allow you to easily add Instagram OpenID Connect (OIDC) flow to your application.

### Installation

```bash
npm i better-auth-instagram
```

### Instagram Setup

1. Go to [Meta Developer Console](https://developers.facebook.com/apps/)
2. Login with your Facebook Account (with a connected Instagram Account)
3. Create a new App with App type "Business"

> [!WARNING]
> Instagram doesn't allow localhost, this is just a demo setup. For your project use an actual domain & deployed server.

```yaml
# For Demo

Client Name: MyApp
Homepage URL: http://localhost:3000
```

4. Add Instagram product to your app
5. Setup API with Instagram business login
6. Add an Instagram Test User to your app
6. Generate access tokens with the test user
7. Set up Instagram business login
8. Paste the redirect URI

```yaml
Authorized Redirect URIs: http://localhost:3000/api/auth/oauth2/callback/instagram
```

9. Copy credentials to your `.env` file

```bash
INSTAGRAM_APP_ID="*****************"
INSTAGRAM_APP_SECRET="*************"
```

### Usage

```ts
import { betterAuth } from "better-auth";
import { instagram } from "better-auth-instagram";

export const auth = betterAuth({
    plugins: [
        instagram(),
    ],
});
```

### Client Side

```ts
import { createAuthClient } from "better-auth/client"
import { genericOAuthClient } from "better-auth/client/plugins"
import type { auth } from "./auth";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(), // optional
        genericOAuthClient() // required
    ]
})
```

```ts
import { authClient } from "./lib/auth";

await authClient.signIn.oauth2({
    providerId: "instagram"
});
```

> [!WARNING]
> If app review isn't completed, only Instagram Tester accounts will be able to sign in to your app.

### Advanced Config

```ts
import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { instagramConfig } from "better-auth-instagram";

export const auth = betterAuth({
    plugins: [
        genericOAuth({
            config: [
                instagramConfig({
                    scopes = ["instagram_business_basic", "instagram_business_manage_messages"],
                    fields = ["id", "name", "username", "account_type"],
                    appId: process.env.INSTAGRAM_APP_ID,
                    appSecret: process.env.INSTAGRAM_APP_SECRET
                }),

                // Add more providers as needed
            ]
        }),
    ],
});
```

### Resources

Make sure to read docs from [Instagram OAuth](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/) before setup.
