"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
class Model {
    constructor(data) {
        this.data = data;
    }
    toJsonString() {
        return JSON.stringify(this.data);
    }
    toMap() {
        return Object.assign({}, this.data);
    }
    get schema() {
        return this.data;
    }
    static fromJson(obj) {
        return new this(obj);
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map