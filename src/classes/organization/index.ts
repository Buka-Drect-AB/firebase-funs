import { BusinessType, DashboardRoles, DocumentSchema } from "../../types";
import { Model } from "../model";
import { generateShortCodeFromName } from '../../utils/system';

interface BankAccount {
  bank: string;
  slug?: string;
  reference?: string;
  account: string;
  name: string;
}

export interface Integration {
  subaccount?: string;
  customer?: string;
  virtualAccount?: BankAccount; // virtual bank account
  payout?: BankAccount;
}

interface Balance {
  current: number;
  lifetime_credits?: number;
  lifetime_debits?: number;
}

export type Organization = {
  name: string;
  slug: string;
  shortCode: string;
  email?: string;
  image?: string;
  ownerId: string;
  industry: string;
  referral?: string;
  type: BusinessType;
  balance?: {
    live?: Balance | null;
    test?: Balance | null;
  };
  accepting_payments?: boolean | null;
  settlement: {
    automatic_payouts?: boolean;
  };
  teamUids?: string[] | null | undefined;
  teamEmails?: string[] | null | undefined;
  roles: { [key: string]: DashboardRoles };
  terms: {
    mandatory: boolean;
    marketing: boolean;
  };
} & DocumentSchema;

export class OrganizationModel extends Model<Organization> {
  public static generateShortCode(name: string): string {
    return generateShortCodeFromName(name);
  }

  public userRole(uid: string): DashboardRoles | undefined {
    return this.schema.roles[uid];
  }
}


export type OrgRequest = {
  org: string;
  uid: string; // authenticated user
} & DocumentSchema;


export type Venue = {
  org: string; // org id
  name: string;
  slug: string;
  createdBy: string;
  image?: string;
  description?: string;
  address?: {
    place?: string;
    city?: string;
    state?: string;
    country?: string;
  }
  isActive: boolean;
} & DocumentSchema;

export type SettlementAccount = {
  org: string;
  createdBy: string;
  isActive: boolean;
  primary: boolean;
  currency: string;
  details: {
    account: string;
    name: string;
    bank: {
      name: string;
      code: string;
    }
  }
} & DocumentSchema;