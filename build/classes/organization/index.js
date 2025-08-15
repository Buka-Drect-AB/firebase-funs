"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModel = void 0;
const model_1 = require("../model");
const system_1 = require("../../utils/system");
class OrganizationModel extends model_1.Model {
    static generateShortCode(name) {
        return (0, system_1.generateShortCodeFromName)(name);
    }
    userRole(uid) {
        return this.schema.roles[uid];
    }
}
exports.OrganizationModel = OrganizationModel;
//# sourceMappingURL=index.js.map