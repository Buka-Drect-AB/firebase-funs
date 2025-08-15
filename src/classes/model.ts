export class Model<T extends Record<string, unknown>> {
  constructor(protected readonly data: T) { }

  toJsonString(): string {
    return JSON.stringify(this.data);
  }

  toMap(): Record<string, unknown> {
    return { ...this.data };
  }

  get schema() {
    return this.data;
  }

  static fromJson<T extends Record<string, unknown>>(this: new (data: T) => any, obj: T) {
    return new this(obj);
  }
}