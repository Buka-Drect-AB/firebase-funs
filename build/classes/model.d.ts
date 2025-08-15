export declare class Model<T extends Record<string, unknown>> {
    protected readonly data: T;
    constructor(data: T);
    toJsonString(): string;
    toMap(): Record<string, unknown>;
    get schema(): T;
    static fromJson<T extends Record<string, unknown>>(this: new (data: T) => any, obj: T): any;
}
