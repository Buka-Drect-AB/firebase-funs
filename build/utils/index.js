"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unixTimeStampNow = unixTimeStampNow;
/**
 * get unix timestamp of now
 * @return {number} timestamp
 */
function unixTimeStampNow() {
    const now = new Date();
    return Math.floor(now.getTime() / 1000);
}
//# sourceMappingURL=index.js.map