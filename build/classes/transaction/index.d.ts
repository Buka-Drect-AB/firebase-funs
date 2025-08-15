import { DocumentSchema, PaymentStatus, TransactionType } from "../..";
import { Model } from "../model";
export interface TransactionRelationship {
    balance_after?: number;
    merchant: string;
    staff?: string;
    venue?: string;
    fee: number;
}
export interface LineItem {
    currency: string;
    amount: number;
    quantity: number;
    item: string;
    reference?: string;
}
export type Transaction = {
    reference: string;
    provider?: string;
    relationship: TransactionRelationship;
    amount: number;
    tax: {
        percentage: number;
        behaviour: 'inclusive' | 'excluded';
    };
    paid_at?: number;
    currency: string;
    customer?: string;
    type: TransactionType;
    provider_fee?: number;
    redirect_url?: string;
    domain: 'test' | 'live';
    status: PaymentStatus;
    payment?: {
        method: string;
        card?: {
            card_type: string;
            first_six: string;
            last_four: string;
            expiry: string;
        };
    };
    metadata?: {
        line_items: LineItem[] | undefined | null;
        related_to?: string;
    };
} & DocumentSchema;
export declare class TransactionModel extends Model<Transaction> {
    static calculateTotal(lineItems: LineItem[]): number;
    static calculateFee(total: number, percentage: number): number;
    static copyWith(transaction: Transaction, updates: Partial<Transaction>): Transaction;
}
