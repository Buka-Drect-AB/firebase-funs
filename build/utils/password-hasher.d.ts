export declare class PinHasher {
    static hashPin(pin: number | string): Promise<string>;
    static comparePin(plainPin: number | string, hashedPin: string): Promise<boolean>;
}
