"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = exports.EMOJI_POOL = void 0;
const __1 = require("../..");
const system_1 = require("../../utils/system");
const model_1 = require("../model");
exports.EMOJI_POOL = [
    // Food & Meals
    "🍔", "🍕", "🍟", "🌮", "🌯", "🥙", "🥪", "🍳", "🥞", "🥗",
    "🍲", "🍝", "🍜", "🍣", "🍤", "🍛", "🍚", "🍘", "🍢", "🥘",
    "🥩", "🍖", "🍗", "🥓", "🧆", "🥫", "🧀", "🍞", "🥯", "🥐",
    "🍩", "🍪", "🎂", "🧁", "🍰", "🍫", "🍬", "🍮", "🍯", "🍿",
    // Drinks & Bar
    "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🍾", "🥤", "🧃",
    "🧋", "🫖", "☕", "🍵", "🍼", "🥛", "🧊", "🍶",
    // Fruits & Fresh
    "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🥝", "🍍", "🥭",
    "🥥", "🫐", "🥑", "🍈", "🍅", "🥒", "🥕", "🌽", "🧄", "🧅",
    // Other
    "🧂", "🍽️", "🧊", "🎉", "🎶", "💡", "🏷️", "🔖", "🧾", "🛒"
];
class CategoryModel extends model_1.Model {
    static getEmojiForCategory(category) {
        const normalized = (0, __1.normalize)(category);
        const EMOJI_OVERRIDES = {
            "cocktails": "🍹",
            "beer": "🍺",
            "coffee": "☕",
            "pizza": "🍕",
            "grill": "🍖",
            "juice": "🧃",
            "smoothies": "🥤",
            "cake": "🎂",
            "bread": "🍞",
            "bar": "🍻"
        };
        if (EMOJI_OVERRIDES[normalized]) {
            return EMOJI_OVERRIDES[normalized];
        }
        const hash = hashStringToInt(normalized);
        const index = hash % exports.EMOJI_POOL.length;
        return exports.EMOJI_POOL[index];
    }
    static extractFromNewBrackets(input) {
        const regex = /new\[([a-zA-Z-]+)\]/;
        const match = input.match(regex);
        return match ? match[1] : null;
    }
    static generate(category, creator) {
        var _a;
        const cat = (_a = this.extractFromNewBrackets(category)) !== null && _a !== void 0 ? _a : category;
        return CategoryModel.fromJson({
            id: (0, system_1.createSlug)(cat),
            name: (0, system_1.unslug)(cat),
            createdBy: creator,
            icon: this.getEmojiForCategory(cat),
            iat: (0, system_1.unixTimeStampNow)(),
            updatedAt: (0, system_1.unixTimeStampNow)(),
        });
    }
}
exports.CategoryModel = CategoryModel;
function hashStringToInt(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
}
//# sourceMappingURL=index.js.map