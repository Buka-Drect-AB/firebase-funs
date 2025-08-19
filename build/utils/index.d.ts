/**
 * get unix timestamp of now
 * @return {number} timestamp
 */
export declare function unixTimeStampNow(): number;
export declare function normalizeDate(input: number | Date | string | null | undefined): Date;
export declare function createSlug(name: string): string;
export declare function unslug(slug: string, capitalize?: boolean): string;
