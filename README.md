<a href="https://github.com/manolo-in/better-auth-instagram">
    <img width="1584" height="396" alt="cover" src="https://github.com/manolo-in/better-auth-instagram/blob/main/cover.png?raw=true" />
</a>

# better-auth-instagram
Instagram Provider for Better-Auth. Wrapper around [Generic OAuth](https://www.better-auth.com/docs/plugins/generic-oauth) plugin.

This package allow you to easily add Login with Instagram to your application.

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
6. Add an Instagram account to your app as roles: Instagram Tester
6. Accept the Tester Invite from that account [manage access](https://www.instagram.com/accounts/manage_access/)
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
import type { auth } from "@/auth";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(), // optional
        genericOAuthClient() // required
    ]
})
```

```ts
import { authClient } from "@/lib/auth";

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
                    getEmail: (profile) => `${profile.username}@example.com`,
                    scopes: ["instagram_business_basic", "instagram_business_manage_messages"],
                    fields: ["id", "name", "username", "account_type"],
                    appId: process.env.INSTAGRAM_APP_ID,
                    appSecret: process.env.INSTAGRAM_APP_SECRET
                }),

                // Add more providers as needed
            ]
        }),
    ],
});
```

### Link Instagram Account with Username

Here is an example of how to link Instagram account.

Because Better-Auth doesn't update profile data on account linking, we need to do it manually using database hooks.

We provided an easy instagram API function created on top of [better-fetch](https://better-fetch.vercel.app/).

```ts
import { betterAuth, APIError } from "better-auth";
import { instagram } from "better-auth-instagram";
import { instagramAPI } from "better-auth-instagram/api";

import { schema, db, eq } from "@/db";

export const auth = betterAuth({
    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: true,
            trustedProviders: ["google", "instagram"],
            updateUserInfoOnLink: true,
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    plugins: [
        instagram(),
    ],
    databaseHooks: {
        account: {
            create: {
                after: async (account, ctx) => {
                    if (account.providerId !== "instagram") return;

                    const { data, error } = await instagramAPI("/me", {
                        query: {
                            fields: ["username"],
                            access_token: account.accessToken as string,
                        },
                    });

                    if (error)
                        throw new APIError("INTERNAL_SERVER_ERROR");

                    // Use manual database query to update username
                    // eg: drizzle-orm
                    await db.update(schema.user)
                        .set({ username: data.username })
                        .where(eq(schema.user.id, account.userId));
                }
            }
        }
    }
});
```

```ts
import { authClient } from "@/lib/auth";

await authClient.oauth2.link({
    providerId: "instagram"
);
```

### Resources

Make sure to read docs from [Instagram OAuth](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/) before setup.
