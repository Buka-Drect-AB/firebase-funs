import { DocumentSchema, StaffRoles } from "../..";
import { Model } from "../model";

export type Staff = {
  org: string; // org id
  createdBy: string; // user id
  whatsapp?: string;
  shortCode: string;
  domain: "test" | "live";
  name: string;
  venues: string[]; // venues this inventory apply to
  pin: string;
  role: StaffRoles;
  imageUrl?: string;
} & DocumentSchema;

export class StaffModel extends Model<Staff> { 
  public static generateShortCode(orgShortCode: string, staffData: { fullName: string; email?: string; phone?: string }): string {
    const baseString = `${staffData.fullName}${staffData.email || ''}${staffData.phone || ''}`;

    // Simple hash to number
    let hash = 0;
    for (let i = 0; i < baseString.length; i++) {
      hash = (hash << 5) - hash + baseString.charCodeAt(i);
      hash |= 0; // Convert to 32bit int
    }

    // Convert hash to uppercase alphanumeric
    const suffix = Math.abs(hash).toString(36).toUpperCase().slice(-4);

    return `${orgShortCode}-${suffix}`;
  }
}