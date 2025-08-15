"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const model_1 = require("../model");
class UserModel extends model_1.Model {
    get accountIsValid() {
        return this.data.naming.first.length > 1 && this.data.naming.last.length > 1;
    }
    get fullname() {
        var _a, _b;
        const naming = this.data.naming;
        // Handle null/undefined input
        if (!naming) {
            return '';
        }
        // Trim whitespace and handle empty strings
        const firstName = ((_a = naming.first) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        const lastName = ((_b = naming.last) === null || _b === void 0 ? void 0 : _b.trim()) || '';
        // If both are empty, return empty string
        if (!firstName && !lastName) {
            return '';
        }
        // If only first name exists
        if (firstName && !lastName) {
            return firstName;
        }
        // If only last name exists
        if (!firstName && lastName) {
            return lastName;
        }
        // Both names exist
        return `${firstName} ${lastName}`;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=index.js.map