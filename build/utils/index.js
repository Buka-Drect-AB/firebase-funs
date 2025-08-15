"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumValue = getEnumValue;
exports.getEnumValueSafe = getEnumValueSafe;
exports.getEnumValueByString = getEnumValueByString;
exports.isValidEnumKey = isValidEnumKey;
exports.normalize = normalize;
/**
 * Generic function to get enum value by key
 * @param enumObj - The enum object to search in
 * @param key - The key to search for
 * @returns The value if found, undefined otherwise
 */
function getEnumValue(enumObj, key) {
    return enumObj[key];
}
/**
 * Type-safe version that ensures the key exists in the enum
 * @param enumObj - The enum object to search in
 * @param key - The key to search for (must be a valid key of the enum)
 * @returns The value for the given key
 */
function getEnumValueSafe(enumObj, key) {
    return enumObj[key];
}
/**
 * Flexible enum value getter that accepts string and returns the value if valid
 * @param enumObj - The enum object to search in
 * @param key - The string key to search for
 * @returns The value if the key exists in the enum, undefined otherwise
 */
function getEnumValueByString(enumObj, key) {
    if (key in enumObj) {
        return enumObj[key];
    }
    return undefined;
}
/**
 * Type guard to check if a string is a valid key for an enum
 * @param enumObj - The enum object to check against
 * @param key - The string to check
 * @returns True if the key exists in the enum
 */
function isValidEnumKey(enumObj, key) {
    return key in enumObj;
}
function normalize(text) {
    return text.trim().toLowerCase();
}
//# sourceMappingURL=index.js.map