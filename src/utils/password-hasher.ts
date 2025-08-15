import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export class PinHasher {
  static async hashPin(pin: number | string): Promise<string> {
    try {
      const pinString = typeof pin === 'number' ? pin.toString() : pin;
      return await bcrypt.hash(pinString, SALT_ROUNDS);
    } catch (error) {
      throw new Error('Failed to hash PIN');
    }
  }

  static async comparePin(plainPin: number | string, hashedPin: string): Promise<boolean> {
    try {
      const pinString = typeof plainPin === 'number' ? plainPin.toString() : plainPin;
      return await bcrypt.compare(pinString, hashedPin);
    } catch (error) {
      throw new Error('Failed to compare PIN');
    }
  }
}