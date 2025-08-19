/**
 * get unix timestamp of now
 * @return {number} timestamp
 */
export function unixTimeStampNow(): number {
  const now = new Date();
  return Math.floor(now.getTime() / 1000);
}

export function normalizeDate(input: number | Date | string | null | undefined): Date {
  if (!input) return new Date(0); // fail-safe
  if (typeof input === 'number') return new Date(input * 1000);
  if (typeof input === 'string') return new Date(input);
  return input;
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