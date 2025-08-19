"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unixTimeStampNow = unixTimeStampNow;
exports.normalizeDate = normalizeDate;
exports.createSlug = createSlug;
exports.unslug = unslug;
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
function createSlug(name) {
    return name
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading/trailing whitespace
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
        .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
function unslug(slug, capitalize = true) {
    let result = slug
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (capitalize) {
        result = result.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
    }
    return result;
}
//# sourceMappingURL=index.js.map