"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModel = void 0;
const model_1 = require("../model");
class StaffModel extends model_1.Model {
    static generateShortCode(orgShortCode, staffData) {
        const baseString = `${staffData.fullName}${staffData.email || ''}${staffData.phone || ''}`;
        // Simple hash to number
        let hash = 0;
        for (let i = 0; i < baseString.length; i++) {
            hash = (hash << 5) - hash + baseString.charCodeAt(i);
            hash |= 0; // Convert to 32bit int
        }
        // Convert hash to uppercase alphanumeric
        const suffix = Math.abs(hash).toString(36).toUpperCase().slice(-4);
        return `${orgShortCode}-${suffix}`;
    }
}
exports.StaffModel = StaffModel;
//# sourceMappingURL=index.js.map