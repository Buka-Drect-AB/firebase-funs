import { AuthenticationProvider } from "../..";
import { Model } from "../model";
export type User = {
    joined: Date | null | string | number;
    lastSeen?: Date | null | string | number;
    id: string;
    naming: {
        first: string;
        last: string;
    };
    isNewUser: boolean;
    email: string;
    roles: {
        client?: boolean | null;
        consumer?: boolean | null;
    };
    photoUrl: string | null | undefined;
    eid?: string;
    phone: string | null | undefined;
    security: {
        emailVerified: boolean;
        phoneVerified: boolean;
        authProvider: AuthenticationProvider;
    };
};
export declare class UserModel extends Model<User> {
    get accountIsValid(): boolean;
    get fullname(): string;
}
