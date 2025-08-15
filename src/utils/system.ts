import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 4); // short & clean

export function generateShortCodeFromName(name: string): string {
  const clean = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')       // remove spaces and special characters
    .slice(0, 3);                    // take up to first 3 letters (e.g. "AKU" from "Akub Ventures")

  const suffix = nanoid();           // e.g., "9X2Q"
  return `${clean}-${suffix}`;       // e.g., "AKU-9X2Q"
}

export function generateStaffShortCode(orgShortCode: string, staffData: { fullName: string; email?: string; phone?: string }): string {
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



export function unixTimeStampNow(): number {
  const now = new Date();
  return Math.floor(now.getTime() / 1000);
}

export function createSlug(name: string): string {
  return name
    .toLowerCase()                    // Convert to lowercase
    .trim()                          // Remove leading/trailing whitespace
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, '-')            // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
}

export function unslug(slug: string, capitalize: boolean = true): string {
  let result = slug
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (capitalize) {
    result = result.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
  }

  return result;
}