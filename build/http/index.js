"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
exports.createHttpClient = createHttpClient;
exports.apiRequest = apiRequest;
const axios_1 = __importDefault(require("axios"));
/**
 * Enhanced HTTP client with improved typing and error handling
 */
class HttpClient {
    constructor(config) {
        this.baseUrl = (config === null || config === void 0 ? void 0 : config.baseUrl) || '';
        this.defaultHeaders = Object.assign({ 'Accept': 'application/json', 'Content-Type': 'application/json' }, config === null || config === void 0 ? void 0 : config.defaultHeaders);
        this.errorHandler = config === null || config === void 0 ? void 0 : config.errorHandler;
    }
    /**
     * Make an HTTP request
     */
    request(method, endpoint, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildUrl(endpoint);
            const headers = this.mergeHeaders(config === null || config === void 0 ? void 0 : config.headers);
            const axiosConfig = {
                method,
                url,
                headers,
                data: config === null || config === void 0 ? void 0 : config.body,
                params: config === null || config === void 0 ? void 0 : config.params,
                timeout: config === null || config === void 0 ? void 0 : config.timeout,
                auth: config === null || config === void 0 ? void 0 : config.auth,
                responseType: config === null || config === void 0 ? void 0 : config.responseType,
            };
            try {
                const response = yield (0, axios_1.default)(axiosConfig);
                return this.createSuccessResponse(response);
            }
            catch (error) {
                return this.handleError(error);
            }
        });
    }
    /**
     * Shorthand for GET requests
     */
    get(endpoint, config) {
        return this.request('GET', endpoint, config);
    }
    /**
     * Shorthand for POST requests
     */
    post(endpoint, body, config) {
        return this.request('POST', endpoint, Object.assign(Object.assign({}, config), { body }));
    }
    /**
     * Shorthand for PUT requests
     */
    put(endpoint, body, config) {
        return this.request('PUT', endpoint, Object.assign(Object.assign({}, config), { body }));
    }
    /**
     * Shorthand for PATCH requests
     */
    patch(endpoint, body, config) {
        return this.request('PATCH', endpoint, Object.assign(Object.assign({}, config), { body }));
    }
    /**
     * Shorthand for DELETE requests
     */
    delete(endpoint, config) {
        return this.request('DELETE', endpoint, config);
    }
    buildUrl(endpoint) {
        // Ensure proper URL joining without double slashes
        return endpoint.startsWith('http')
            ? endpoint
            : `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    }
    mergeHeaders(customHeaders) {
        return Object.assign(Object.assign({}, this.defaultHeaders), customHeaders);
    }
    createSuccessResponse(response) {
        return {
            success: true,
            data: response.data,
            metadata: {
                statusCode: response.status,
                headers: response.headers,
            },
        };
    }
    handleError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            let errorResponse = {
                success: false,
                error: {
                    message: 'An unexpected error occurred',
                },
                data: undefined,
            };
            // Check if error is an AxiosError
            if (axios_1.default.isAxiosError(error)) {
                const axiosError = error;
                const response = axiosError.response;
                errorResponse = {
                    success: false,
                    error: {
                        message: ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.message) ||
                            ((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.error) ||
                            axiosError.message ||
                            'An unexpected error occurred',
                        code: response === null || response === void 0 ? void 0 : response.status,
                        details: response === null || response === void 0 ? void 0 : response.data,
                    },
                    metadata: {
                        statusCode: (_c = response === null || response === void 0 ? void 0 : response.status) !== null && _c !== void 0 ? _c : 0,
                        headers: response === null || response === void 0 ? void 0 : response.headers,
                    },
                    data: undefined,
                };
            }
            else if (error instanceof Error) {
                // Non-Axios error
                errorResponse.error = {
                    message: error.message,
                };
            }
            // Call custom error handler if provided
            if (this.errorHandler) {
                yield this.errorHandler({
                    message: ((_d = errorResponse.error) === null || _d === void 0 ? void 0 : _d.message) || 'Unknown error',
                    statusCode: (_e = errorResponse.metadata) === null || _e === void 0 ? void 0 : _e.statusCode,
                    details: (_f = errorResponse.error) === null || _f === void 0 ? void 0 : _f.details,
                    isAxiosError: axios_1.default.isAxiosError(error),
                });
            }
            console.error("Axios error: ", {
                alert: JSON.stringify(errorResponse),
            });
            return errorResponse;
        });
    }
}
exports.HttpClient = HttpClient;
/**
 * Factory function to create a pre-configured HTTP client instance
 */
function createHttpClient(config) {
    return new HttpClient(config);
}
/**
 * Utility function for making API requests with the global HTTP client
 * (Maintained for backward compatibility)
 */
function apiRequest(method, url, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new HttpClient();
        return client.request(method, url, config);
    });
}
//# sourceMappingURL=index.js.map