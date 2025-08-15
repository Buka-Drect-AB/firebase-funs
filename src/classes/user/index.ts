import { AuthenticationProvider } from "../..";
import { Model } from "../model";

export type User = {
  joined: Date | null | string | number;
  lastSeen?: Date | null | string | number;
  id: string;
  naming: {
    first: string;
    last: string;
  },
  isNewUser: boolean;
  email: string;
  roles: {
    client?: boolean | null;
    consumer?: boolean | null;
  },
  photoUrl: string | null | undefined;
  eid?: string;
  phone: string | null | undefined;
  security: {
    emailVerified: boolean;
    phoneVerified: boolean;
    authProvider: AuthenticationProvider;
  },
}

export class UserModel extends Model<User> {

  public get accountIsValid(): boolean {
    return this.data.naming.first.length > 1 && this.data.naming.last.length > 1;
  }

  public get fullname(): string {
    const naming = this.data.naming;
    // Handle null/undefined input
    if (!naming) {
      return '';
    }

    // Trim whitespace and handle empty strings
    const firstName = naming.first?.trim() || '';
    const lastName = naming.last?.trim() || '';

    // If both are empty, return empty string
    if (!firstName && !lastName) {
      return '';
    }

    // If only first name exists
    if (firstName && !lastName) {
      return firstName;
    }

    // If only last name exists
    if (!firstName && lastName) {
      return lastName;
    }

    // Both names exist
    return `${firstName} ${lastName}`;
  }
}
 