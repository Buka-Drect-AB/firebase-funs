/**
 * HTTP Methods supported by this utility
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
/**
 * Standardized response structure for API calls
 */
export interface StandardResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string | number;
        details?: unknown;
    };
    metadata?: {
        statusCode: number;
        headers?: Record<string, string>;
        [key: string]: unknown;
    };
}
/**
 * Configuration options for HTTP requests
 */
export interface HttpRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    timeout?: number;
    auth?: {
        username: string;
        password: string;
    };
    responseType?: 'json' | 'arraybuffer' | 'blob' | 'document' | 'text' | 'stream';
    [key: string]: unknown;
}
/**
 * Extended request interface with body support
 */
export interface HttpRequest extends HttpRequestConfig {
    body?: unknown;
}
/**
 * Error handler function type
 */
export type ErrorHandler = (error: {
    message: string;
    statusCode?: number;
    details?: unknown;
    isAxiosError: boolean;
}) => void | Promise<void>;
/**
 * Enhanced HTTP client with improved typing and error handling
 */
export declare class HttpClient {
    private baseUrl;
    private defaultHeaders;
    private errorHandler?;
    constructor(config?: {
        baseUrl?: string;
        defaultHeaders?: Record<string, string>;
        errorHandler?: ErrorHandler;
    });
    /**
     * Make an HTTP request
     */
    request<T = unknown>(method: HttpMethod, endpoint: string, config?: HttpRequest): Promise<StandardResponse<T>>;
    /**
     * Shorthand for GET requests
     */
    get<T = unknown>(endpoint: string, config?: HttpRequestConfig): Promise<StandardResponse<T>>;
    /**
     * Shorthand for POST requests
     */
    post<T = unknown>(endpoint: string, body?: unknown, config?: HttpRequestConfig): Promise<StandardResponse<T>>;
    /**
     * Shorthand for PUT requests
     */
    put<T = unknown>(endpoint: string, body?: unknown, config?: HttpRequestConfig): Promise<StandardResponse<T>>;
    /**
     * Shorthand for PATCH requests
     */
    patch<T = unknown>(endpoint: string, body?: unknown, config?: HttpRequestConfig): Promise<StandardResponse<T>>;
    /**
     * Shorthand for DELETE requests
     */
    delete<T = unknown>(endpoint: string, config?: HttpRequestConfig): Promise<StandardResponse<T>>;
    private buildUrl;
    private mergeHeaders;
    private createSuccessResponse;
    private handleError;
}
/**
 * Factory function to create a pre-configured HTTP client instance
 */
export declare function createHttpClient(config?: {
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
    errorHandler?: ErrorHandler;
}): HttpClient;
/**
 * Utility function for making API requests with the global HTTP client
 * (Maintained for backward compatibility)
 */
export declare function apiRequest<T = unknown>(method: HttpMethod, url: string, config?: HttpRequest): Promise<StandardResponse<T>>;
