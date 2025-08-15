export interface KnockFeedFetchArgs {
    user: string;
    feed?: string;
    options?: {
        page_size?: number;
        after?: string;
        before?: string;
    };
}
export interface KnockIdentifyArgs {
    email: string;
    name: string;
    avatar_url: string;
    properties: Record<string, unknown>;
}
export declare const NOTIFICATION_CATEGORIES: {
    readonly ACCOUNT_WELCOME: "welcome-user";
    readonly PROFILE_UPDATE: "profile-update";
    readonly TEAM_INVITE: "team-invite";
    readonly TEAM_JOINED: "team-joined";
    readonly PAYMENT_SUCCESS: "payment-success";
    readonly PAYMENT_FAILED: "payment-failed";
    readonly SUBSCRIPTION_UPGRADE: "subscription-upgrade";
    readonly SUBSCRIPTION_DOWNGRADE: "subscription-downgrade";
    readonly SYSTEM_MAINTENANCE: "system-maintenance";
    readonly SYSTEM_UPDATE: "system-update";
};
export type NotificationCategory = typeof NOTIFICATION_CATEGORIES[keyof typeof NOTIFICATION_CATEGORIES];
export type RecipientMap = {
    id: string;
    email: string;
    name: string;
};
export interface KnockNotificationPreferences {
    email?: boolean;
    push?: boolean;
    in_app?: boolean;
    sms?: boolean;
}
