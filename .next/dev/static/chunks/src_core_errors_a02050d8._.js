(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/core/errors/apiErrors.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "InternalServerError",
    ()=>InternalServerError,
    "NotFoundError",
    ()=>NotFoundError,
    "UnauthorizedError",
    ()=>UnauthorizedError,
    "ValidationError",
    ()=>ValidationError
]);
class ApiError extends Error {
    status;
    detail;
    constructor(status, detail){
        super(typeof detail === 'string' ? detail : 'An API error occurred');
        this.name = 'ApiError';
        this.status = status;
        this.detail = detail;
    }
}
class ValidationError extends ApiError {
    errors;
    constructor(detail){
        super(422, detail);
        this.name = 'ValidationError';
        this.errors = Array.isArray(detail) ? detail : [
            detail
        ];
    }
}
class UnauthorizedError extends ApiError {
    constructor(detail = 'Unauthorized'){
        super(401, detail);
        this.name = 'UnauthorizedError';
    }
}
class NotFoundError extends ApiError {
    constructor(detail = 'Resource not found'){
        super(404, detail);
        this.name = 'NotFoundError';
    }
}
class InternalServerError extends ApiError {
    constructor(detail = 'Internal server error'){
        super(500, detail);
        this.name = 'InternalServerError';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/core/errors/errorHandler.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleApiResponseError",
    ()=>handleApiResponseError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/errors/apiErrors.ts [app-client] (ecmascript)");
;
const handleApiResponseError = async (response)=>{
    const status = response.status;
    let errorData;
    try {
        errorData = await response.json();
    } catch (e) {
        errorData = {
            detail: response.statusText || 'Unknown error'
        };
    }
    const detail = errorData.detail || errorData.message || 'An unexpected error occurred';
    switch(status){
        case 401:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UnauthorizedError"](detail);
        case 404:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotFoundError"](detail);
        case 422:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationError"](detail);
        case 500:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InternalServerError"](detail);
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"](status, detail);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_core_errors_a02050d8._.js.map