export declare const collections: {
    readonly users: "users";
    readonly orgs: "orgs";
    readonly staffs: "staffs";
    readonly orgRequests: "orgRequests";
    readonly venues: "venues";
    readonly accounts: "accounts";
    readonly subscriptions: "subscriptions";
    readonly payments: "payments";
    readonly transactions: "transactions";
    readonly customers: "customers";
    readonly categories: "categories";
    readonly terminals: "terminals";
    readonly inventory: "inventory";
};
export declare const plans: {
    readonly basic: "basic";
    readonly scale: "scale";
};
export declare const roles: {
    readonly owner: "owner";
    readonly admin: "admin";
    readonly supervisor: "supervisor";
    readonly viewer: "viewer";
};
export declare const staffRoles: {
    readonly processor: "Order processor";
    readonly cashier: "Transaction handler";
};
export declare const authProvider: {
    readonly email: "Email address";
    readonly pasby: "pasby e-ID (National Identification Number)";
    readonly pasbyMail: "pasby and email authentication";
};
export declare const businessType: {
    readonly llc: "Limited company";
    readonly sole: "Sole trader";
};
export declare const paymentStatus: {
    paid: "paid";
    pending: "pending";
    failed: "failed";
    refunded: "refunded";
    cancelled: "cancelled";
};
export declare const transactionType: {
    credit: "credit";
    debit: "debit";
};
export declare const environmentType: {
    live: "live";
    test: "test";
};
export type PaymentStatus = keyof typeof paymentStatus;
export type TransactionType = keyof typeof transactionType;
export type BillingPlans = keyof typeof plans;
export type BusinessType = keyof typeof businessType;
export type DashboardRoles = keyof typeof roles;
export type StaffRoles = keyof typeof staffRoles;
export type EnvironmentType = keyof typeof environmentType;
export type AuthenticationProvider = keyof typeof authProvider;
