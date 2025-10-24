import { genericOAuth, type GenericOAuthConfig } from "better-auth/plugins";
import type * as Auth from "better-auth";

export type InstagramProfile = {
    emailVerified: boolean;
    id: string;
    name: string;
    username: string;
    account_type: "BUSINESS" | "CREATOR" | "PERSONAL" | (string & {})
};


export type InstagramOptions = {
    /**
     * To specify which scopes to request from Instagram API.
     * @default ["instagram_business_basic"]
     */
    scopes?: (
        "instagram_business_basic" |
        "instagram_business_manage_messages" |
        "instagram_business_content_publish" |
        "instagram_business_manage_insights" |
        "instagram_business_manage_comments"
    )[];
    /**
     * To specify which fields to fetch from Instagram API for user profile.
     * @default ["id", "name", "username"]
     */
    fields?: (
        "id" |
        "name" |
        "username" |
        "account_type"
    )[];
    /**
     * To generate a placeholder email since Instagram API does not provide email.
     *
     * @default `${profile.id}@instagram.com`
     */
    getEmail?: (profile: Partial<InstagramProfile> & { id: string }) => string;
    /**
     * Same as `clientId` in GenericOAuthConfig.
     *
     * @default process.env.INSTAGRAM_APP_ID
     */
    appId?: string;
    /**
     * Same as `clientSecret` in GenericOAuthConfig.
     *
     * @default process.env.INSTAGRAM_APP_SECRET
     */
    appSecret?: string;
    /**
     * Configuration interface for generic OAuth providers.
     */
    config?: GenericOAuthConfig;
};

/**
 * Resources
 * https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
 */
export const instagramConfig = ({
    appId = process.env.INSTAGRAM_APP_ID as string,
    appSecret = process.env.INSTAGRAM_APP_SECRET,

    scopes = ["instagram_business_basic"],
    fields = ["id", "name", "username"],
    getEmail = (profile) => `${profile.id}@instagram.com`,

    config,
}: InstagramOptions) => {
    const userInfoUrl = `https://graph.instagram.com/me?fields=${fields.join(",")}`;
    return {
        providerId: "instagram",
        clientId: appId,
        clientSecret: appSecret,
        authorizationUrl: "https://instagram.com/oauth/authorize",
        tokenUrl: "https://api.instagram.com/oauth/access_token",
        userInfoUrl,
        scopes,
        mapProfileToUser: (profile) => {
            const data = profile as InstagramProfile;

            return {
                ...profile,
                email: getEmail(data),
            };
        },
        ...config,
    } as const satisfies GenericOAuthConfig;
};

/**
 * Resources
 * https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
 */
export const instagram = (options: InstagramOptions) =>
    genericOAuth({
        config: [instagramConfig(options)],
    });
