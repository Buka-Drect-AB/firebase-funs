import { DocumentSchema, normalize } from "../..";
import { createSlug, unixTimeStampNow, unslug } from "../../utils/system";
import { Model } from "../model";

export const EMOJI_POOL = [
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



export type Category = {
  name: string; // e.g., "Cocktails", "Grilled Meat", "Soft Drinks"
  icon: string; // could be a URL or an icon key reference (see below)
  createdBy?: string; // optional: userId of business that created it
} & DocumentSchema; // id is slugified or hashed version of name

export class CategoryModel extends Model<Category> {
  public static getEmojiForCategory(category: string): string {
    const normalized = normalize(category);
    const EMOJI_OVERRIDES: Record<string, string> = {
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
    const index = hash % EMOJI_POOL.length;
    return EMOJI_POOL[index];
  }

  public static extractFromNewBrackets(input: string): string | null {
    const regex = /new\[([a-zA-Z-]+)\]/;
    const match = input.match(regex);

    return match ? match[1] : null;
  }

  public static generate(category: string, creator: string): CategoryModel {
    const cat = this.extractFromNewBrackets(category) ?? category;
    return CategoryModel.fromJson({
      id: createSlug(cat),
      name: unslug(cat),
      createdBy: creator,
      icon: this.getEmojiForCategory(cat),
      iat: unixTimeStampNow(),
      updatedAt: unixTimeStampNow(),
    });
  }
}

function hashStringToInt(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}