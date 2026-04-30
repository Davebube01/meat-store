module.exports = [
"[project]/src/core/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "fetchClient",
    ()=>fetchClient,
    "getAuthHeader",
    ()=>getAuthHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/store/useAuthStore.ts [app-ssr] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://127.0.0.1:8000") || 'http://127.0.0.1:8000';
const getAuthHeader = ()=>{
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].getState().token;
    return token ? {
        'Authorization': `Bearer ${token}`
    } : {};
};
const fetchClient = async (endpoint, options = {})=>{
    const isServer = ("TURBOPACK compile-time value", "undefined") === 'undefined';
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : {}
    };
    const res = await fetch(url, {
        ...options,
        headers
    });
    if (!res.ok) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const { handleApiResponseError } = await __turbopack_context__.A("[project]/src/core/errors/errorHandler.ts [app-ssr] (ecmascript, async loader)");
        await handleApiResponseError(res);
    }
    return res.json();
};
}),
"[project]/src/core/api/admin/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateAdmin",
    ()=>authenticateAdmin,
    "createAdminCategory",
    ()=>createAdminCategory,
    "createAdminProduct",
    ()=>createAdminProduct,
    "deleteAdminCategory",
    ()=>deleteAdminCategory,
    "deleteAdminProduct",
    ()=>deleteAdminProduct,
    "getAdminMe",
    ()=>getAdminMe,
    "updateAdminCategory",
    ()=>updateAdminCategory,
    "updateAdminProduct",
    ()=>updateAdminProduct,
    "uploadAdminImage",
    ()=>uploadAdminImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-ssr] (ecmascript)");
;
const uploadAdminImage = async (file)=>{
    const formData = new FormData();
    formData.append('file', file);
    const headers = {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeader"])()
    };
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/admin/upload`, {
        method: 'POST',
        headers,
        body: formData
    });
    if (!res.ok) {
        const { handleApiResponseError } = await __turbopack_context__.A("[project]/src/core/errors/errorHandler.ts [app-ssr] (ecmascript, async loader)");
        await handleApiResponseError(res);
    }
    const data = await res.json();
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${data.imageUrl}`;
};
const createAdminProduct = async (product)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchClient"])('/admin/products', {
        method: 'POST',
        body: JSON.stringify(product)
    });
};
const updateAdminProduct = async (id, productData)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    });
};
const deleteAdminProduct = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/products/${id}`, {
            method: 'DELETE',
            headers: {
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeader"])()
            }
        });
        return true;
    } catch (error) {
        return false;
    }
};
const createAdminCategory = async (category)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchClient"])('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(category)
    });
};
const updateAdminCategory = async (id, categoryData)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    });
};
const deleteAdminCategory = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/categories/${id}`, {
            method: 'DELETE',
            headers: {
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthHeader"])()
            }
        });
        return true;
    } catch (error) {
        return false;
    }
};
const authenticateAdmin = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchClient"])("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
    });
};
const getAdminMe = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchClient"])("/admin/auth/me");
};
}),
];

//# sourceMappingURL=src_core_api_7ae7c178._.js.map