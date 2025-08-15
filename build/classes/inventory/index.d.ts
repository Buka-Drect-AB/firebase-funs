import { DocumentSchema } from "../..";
import { Model } from "../model";
export type Inventory = {
    org: string;
    venues: string[];
    price: number;
    currency: string;
    description?: string;
    name: string;
    isAvailable: boolean;
    category: string;
    imageUrl?: string;
} & DocumentSchema;
export declare class InventoryItemModel extends Model<Inventory> {
}
