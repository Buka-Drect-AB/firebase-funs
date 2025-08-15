import { DocumentSchema, PaymentStatus, TransactionType } from "../..";
import { Model } from "../model";

export interface TransactionRelationship {
  balance_after?: number;
  merchant: string;
  staff?: string;
  venue?: string;
  fee: number;
}

export interface LineItem { currency: string, amount: number, quantity: number, item: string, reference?: string };
export type Transaction = {
  reference: string;
  provider?: string;
  relationship: TransactionRelationship;
  amount: number;
  tax: {
    percentage: number,
    behaviour: 'inclusive' | 'excluded'
  };
  paid_at?: number;
  currency: string;
  customer?: string;
  type: TransactionType;
  provider_fee?: number;
  redirect_url?: string;
  domain: 'test' | 'live';
  status: PaymentStatus,
  payment?: {
    method: string;
    card?: {
      card_type: string;
      first_six: string;
      last_four: string;
      expiry: string;
    },
  } 
  metadata?: {
    line_items: LineItem[] | undefined | null,
    related_to?: string; // if was a retry of an older transaction that failed
  },
} & DocumentSchema;

export class TransactionModel extends Model<Transaction> { 
  
  public static calculateTotal(lineItems: LineItem[]): number {
    // Validate all items have the same currency if there are multiple items
    if (lineItems.length > 1) {
      const firstCurrency = lineItems[0].currency;
      if (!lineItems.every(item => item.currency === firstCurrency)) {
        throw new Error("All line items must have the same currency to calculate total");
      }
    }

    // Calculate total amount
    const total = lineItems.reduce((sum, item) => {
      return sum + (item.amount * item.quantity);
    }, 0);

    // Return as number (caller can format as needed)
    return total;
  }

  public static calculateFee(total: number, percentage: number) {
    return (total * percentage) / 100;
  }

  public static copyWith(transaction: Transaction, updates: Partial<Transaction>): Transaction {
    return {
      ...transaction,
      ...updates,
      // Handle nested objects that need deep merging
      relationship: updates.relationship 
        ? { ...transaction.relationship, ...updates.relationship }
        : transaction.relationship,
      tax: updates.tax 
        ? { ...transaction.tax, ...updates.tax }
        : transaction.tax,
      metadata: updates.metadata 
        ? { ...transaction.metadata, ...updates.metadata }
        : transaction.metadata,
    };
  }
}