"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentType = exports.transactionType = exports.paymentStatus = exports.businessType = exports.authProvider = exports.staffRoles = exports.roles = exports.plans = exports.collections = void 0;
exports.collections = {
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
};
exports.plans = {
    basic: "basic",
    scale: "scale",
};
exports.roles = {
    owner: "owner",
    admin: "admin",
    supervisor: "supervisor",
    viewer: "viewer",
};
exports.staffRoles = {
    processor: "Order processor",
    cashier: "Transaction handler",
};
exports.authProvider = {
    email: "Email address",
    pasby: "pasby e-ID (National Identification Number)",
    pasbyMail: "pasby and email authentication"
};
exports.businessType = {
    llc: "Limited company",
    sole: "Sole trader",
};
exports.paymentStatus = strEnum(['paid', 'pending', 'failed', 'refunded', 'cancelled']);
exports.transactionType = strEnum(['credit', 'debit']);
exports.environmentType = strEnum(['live', 'test']);
function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
//# sourceMappingURL=enums.js.map