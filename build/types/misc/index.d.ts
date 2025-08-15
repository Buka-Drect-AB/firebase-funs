export declare const BUSINESS_INDUSTRIES: {
    value: string;
    label: string;
}[];
export interface Authorization {
    customer: {
        test?: string;
        live?: string;
    };
    map: {
        card_type: string;
        channel: string;
        brand: string;
        country_code: string;
        exp_month: string;
        exp_year: string;
        last4: string;
        reusable: boolean;
    };
    keep: string;
}
export type DocumentSchema = {
    id: string;
    iat: Date | null | string | number;
    updatedAt?: Date | null | string | number;
};
export type reactSelectOptionsType = {
    label: string;
    group: string;
    value: string;
};
