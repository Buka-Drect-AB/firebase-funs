export declare function generateShortCodeFromName(name: string): string;
export declare function generateStaffShortCode(orgShortCode: string, staffData: {
    fullName: string;
    email?: string;
    phone?: string;
}): string;
export declare function unixTimeStampNow(): number;
export declare function createSlug(name: string): string;
export declare function unslug(slug: string, capitalize?: boolean): string;
