module.exports = [
"[project]/src/core/errors/apiErrors.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/core/errors/errorHandler.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleApiResponseError",
    ()=>handleApiResponseError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/errors/apiErrors.ts [app-rsc] (ecmascript)");
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
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UnauthorizedError"](detail);
        case 404:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NotFoundError"](detail);
        case 422:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ValidationError"](detail);
        case 500:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["InternalServerError"](detail);
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$errors$2f$apiErrors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"](status, detail);
    }
};
}),
];

//# sourceMappingURL=src_core_errors_e5745141._.js.map