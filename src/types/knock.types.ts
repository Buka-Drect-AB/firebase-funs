export interface KnockFeedFetchArgs {
  user: string;
  feed?: string;
  options?: {
    page_size?: number;
    after?: string;
    before?: string;
  }
}

export interface KnockIdentifyArgs {
  email: string;
  name: string;
  avatar_url: string;
  properties: Record<string, unknown>
}


// Notification categories for your app
export const NOTIFICATION_CATEGORIES = {
  // User account notifications
  ACCOUNT_WELCOME: 'welcome-user', // slc nice to have
  PROFILE_UPDATE: 'profile-update',

  // business notifications
  TEAM_INVITE: 'team-invite', // slc required
  TEAM_JOINED: 'team-joined', // slc required

  // Payment and subscription
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
  SUBSCRIPTION_UPGRADE: 'subscription-upgrade',
  SUBSCRIPTION_DOWNGRADE: 'subscription-downgrade',

  // System notifications
  SYSTEM_MAINTENANCE: 'system-maintenance',
  SYSTEM_UPDATE: 'system-update',
} as const;

export type NotificationCategory = typeof NOTIFICATION_CATEGORIES[keyof typeof NOTIFICATION_CATEGORIES];
export type RecipientMap = { id: string, email: string, name: string };

export interface KnockNotificationPreferences {
  email?: boolean;
  push?: boolean;
  in_app?: boolean;
  sms?: boolean;
}