"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_CATEGORIES = void 0;
// Notification categories for your app
exports.NOTIFICATION_CATEGORIES = {
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
};
//# sourceMappingURL=knock.types.js.map