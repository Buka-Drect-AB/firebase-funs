import { DocumentSchema } from "../..";
import { Model } from "../model";

export type Inventory = {
  org: string; // org id
  venues: string[]; // venues this inventory apply to
  price: number;
  currency: string;
  description?: string;
  name: string;
  isAvailable: boolean;
  category: string; // Free-form user input, normalized as needed
  imageUrl?: string;
} & DocumentSchema;

export class InventoryItemModel extends Model<Inventory> { }
