"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unixTimeStampNow = unixTimeStampNow;
exports.normalizeDate = normalizeDate;
/**
 * get unix timestamp of now
 * @return {number} timestamp
 */
function unixTimeStampNow() {
    const now = new Date();
    return Math.floor(now.getTime() / 1000);
}
function normalizeDate(input) {
    if (!input)
        return new Date(0); // fail-safe
    if (typeof input === 'number')
        return new Date(input * 1000);
    if (typeof input === 'string')
        return new Date(input);
    return input;
}
//# sourceMappingURL=index.js.map