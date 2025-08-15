import { DocumentSchema, Transaction } from "../..";
import { Model } from "../model";

export type Terminal = {
  name: string;
  bank: {
    name: string;
    code: string;
  },
  account: string;
  domain: Transaction['domain'],
  reference: string;
  merchant: string;
  venue: string;
  provider: {
    source: string;
    id: string;
  },
  bvn: string;
  currency: string;
} & DocumentSchema;

export class TerminalModel extends Model<Terminal> {

}