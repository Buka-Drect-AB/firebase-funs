export const collections = {
  users: "users",
  orgs: "orgs",
  staffs: "staffs",
  orgRequests: "orgRequests",
  venues: "venues", // sub document
  accounts: "accounts", // sub document
  subscriptions: "subscriptions",
  payments: "payments",
  transactions: "transactions",
  customers: "customers",
  categories: "categories",
  terminals: "terminals",
  inventory: "inventory", // sub document
} as const;

export const plans = {
  basic: "basic",
  scale: "scale",
} as const;

export const roles = {
  owner: "owner",
  admin: "admin",
  supervisor: "supervisor",
  viewer: "viewer",
} as const;

export const staffRoles = {
  processor: "Order processor",
  cashier: "Transaction handler",
} as const;

export const authProvider = {
  email: "Email address",
  pasby: "pasby e-ID (National Identification Number)",
  pasbyMail: "pasby and email authentication"
} as const;

export const businessType = {
  llc: "Limited company",
  sole: "Sole trader",
} as const;

export const paymentStatus = strEnum(['paid', 'pending', 'failed', 'refunded', 'cancelled']);
export const transactionType = strEnum(['credit', 'debit']);
export const environmentType = strEnum(['live', 'test']);

export type PaymentStatus = keyof typeof paymentStatus;
export type TransactionType = keyof typeof transactionType;
export type BillingPlans = keyof typeof plans;
export type BusinessType = keyof typeof businessType;
export type DashboardRoles = keyof typeof roles;
export type StaffRoles = keyof typeof staffRoles;
export type EnvironmentType = keyof typeof environmentType;
export type AuthenticationProvider = keyof typeof authProvider;


function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}