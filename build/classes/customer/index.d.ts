import { DocumentSchema } from "../..";
import { Model } from "../model";
export type Customer = {
    name: string | null | undefined;
    email: string;
    metadata?: Record<string, unknown>;
    providers?: {
        [key: string]: null | Record<string, unknown>;
    };
} & DocumentSchema;
export declare class CustomerModel extends Model<Customer> {
}
