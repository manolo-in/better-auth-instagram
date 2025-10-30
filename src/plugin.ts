import { genericOAuth, type GenericOAuthConfig } from "better-auth/plugins";
import type { Fields } from "./utils";
import type * as Auth from "better-auth";

export type InstagramProfile = {
    emailVerified: boolean;
    id: string;
    name: string;
    username: string;
    account_type: "BUSINESS" | "CREATOR" | "PERSONAL" | (string & {})
    profile_picture_url?: string
};


export type InstagramOptions = {
    /**
     * To specify which scopes to request from Instagram API.
     *
     * @default ["instagram_business_basic"]
     */
    scopes?: (
        "instagram_business_basic" |
        "instagram_business_manage_messages" |
        "instagram_business_content_publish" |
        "instagram_business_manage_insights" |
        "instagram_business_manage_comments" |
        (string & {})
    )[];
    /**
     * To specify which fields to fetch from Instagram API for user profile.
     *
     * @default ["id", "name", "username", "profile_picture_url"]
     */
    fields?: (Fields | (string & {}))[];
    /**
     * To generate a placeholder email since Instagram API does not provide email.
     *
     * @default `${profile.id}@instagram.com`
     */
    getEmail?: (profile: Partial<InstagramProfile> & { id: string }) => string;
    /**
     * To force a user to re-authenticate with their credentials, even if they are currently logged in to Instagram.
     *
     * @default false
     */
    forceReAuth?: boolean;
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
 * @see https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
 */
export const instagramConfig = ({
    appId = process.env.INSTAGRAM_APP_ID as string,
    appSecret = process.env.INSTAGRAM_APP_SECRET,
    forceReAuth = false,

    scopes = ["instagram_business_basic"],
    fields = ["id", "name", "username", "profile_picture_url"],
    getEmail = (profile) => `${profile.id}@instagram.com`,

    config,
}: InstagramOptions = {}) => {
    const userInfoUrl = `https://graph.instagram.com/me?fields=${fields.join(",")}`;
    const authorizationUrl = `https://instagram.com/oauth/authorize${forceReAuth ? "?force_reauth=true" : ""}`;

    return {
        providerId: "instagram",
        clientId: appId,
        clientSecret: appSecret,
        authorizationUrl,
        tokenUrl: "https://api.instagram.com/oauth/access_token",
        userInfoUrl,
        scopes,
        mapProfileToUser: (profile) => {
            const data = profile as InstagramProfile;

            return {
                ...profile,
                image: data.profile_picture_url,
                email: getEmail(data),
            };
        },
        ...config,
    } as const satisfies GenericOAuthConfig;
};

/**
 * @see https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
 */
export const instagram = (options: InstagramOptions = {}) =>
    genericOAuth({
        config: [instagramConfig(options)],
    });
