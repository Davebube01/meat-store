module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/core/store/useAuthStore.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-rsc] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        setAuth: (token, user)=>set({
                token,
                user,
                isAuthenticated: true,
                isAdmin: !!user.is_superuser
            }),
        signOut: ()=>set({
                token: null,
                user: null,
                isAuthenticated: false,
                isAdmin: false
            }),
        updateProfile: (updatedUser)=>set((state)=>({
                    user: state.user ? {
                        ...state.user,
                        ...updatedUser
                    } : null,
                    isAdmin: updatedUser.is_superuser !== undefined ? !!updatedUser.is_superuser : state.isAdmin
                }))
    }), {
    name: 'meat-store-auth'
}));
}),
"[project]/src/core/api/client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "fetchClient",
    ()=>fetchClient,
    "getAuthHeader",
    ()=>getAuthHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/store/useAuthStore.ts [app-rsc] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://127.0.0.1:8000") || 'http://127.0.0.1:8000';
const getAuthHeader = ()=>{
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useAuthStore"].getState().token;
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
        const errorBody = await res.json().catch(()=>({}));
        throw new Error(errorBody.detail || `Request failed with status ${res.status}`);
    }
    return res.json();
};
}),
"[project]/src/core/api/user/auth/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateUser",
    ()=>authenticateUser,
    "getUserMe",
    ()=>getUserMe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const authenticateUser = async (payload, isLogin)=>{
    const endpoint = isLogin ? "/api/v1/auth/login/json" : "/api/v1/auth/register";
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
    });
};
const getUserMe = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])("/api/v1/auth/me");
};
}),
"[project]/src/core/api/user/products/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProductBySlug",
    ()=>getProductBySlug,
    "getProducts",
    ()=>getProducts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const getProducts = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])('/api/v1/products/', {
        cache: 'no-store'
    });
};
const getProductBySlug = async (slug)=>{
    const products = await getProducts();
    return products.find((p)=>p.slug === slug);
};
}),
"[project]/src/core/api/user/categories/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCategories",
    ()=>getCategories
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const getCategories = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])('/api/v1/categories', {
        cache: 'no-store'
    });
};
}),
"[project]/src/core/api/admin/auth/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminLogin",
    ()=>adminLogin,
    "getAdminMe",
    ()=>getAdminMe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const adminLogin = async (email, password)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        })
    });
};
const getAdminMe = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])("/admin/auth/me");
};
}),
"[project]/src/core/api/admin/products/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminProduct",
    ()=>createAdminProduct,
    "deleteAdminProduct",
    ()=>deleteAdminProduct,
    "getAdminProductById",
    ()=>getAdminProductById,
    "getAdminProductBySlug",
    ()=>getAdminProductBySlug,
    "getAdminProducts",
    ()=>getAdminProducts,
    "updateAdminProduct",
    ()=>updateAdminProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const getAdminProducts = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])('/admin/products', {
        cache: 'no-store'
    });
};
const getAdminProductById = async (id)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/products/${id}`, {
        cache: 'no-store'
    });
};
const getAdminProductBySlug = async (slug)=>{
    const products = await getAdminProducts();
    return products.find((p)=>p.slug === slug);
};
const createAdminProduct = async (product)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])('/admin/products', {
        method: 'POST',
        body: JSON.stringify(product)
    });
};
const updateAdminProduct = async (id, productData)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    });
};
const deleteAdminProduct = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/products/${id}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        return false;
    }
};
}),
"[project]/src/core/api/admin/categories/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminCategory",
    ()=>createAdminCategory,
    "deleteAdminCategory",
    ()=>deleteAdminCategory,
    "updateAdminCategory",
    ()=>updateAdminCategory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const createAdminCategory = async (category)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(category)
    });
};
const updateAdminCategory = async (id, categoryData)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    });
};
const deleteAdminCategory = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/categories/${id}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        return false;
    }
};
}),
"[project]/src/core/api/admin/upload/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "uploadAdminImage",
    ()=>uploadAdminImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const uploadAdminImage = async (file)=>{
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/admin/upload`, {
        method: 'POST',
        headers: {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuthHeader"])()
        },
        body: formData
    });
    if (!res.ok) throw new Error('Failed to upload image');
    const data = await res.json();
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${data.imageUrl}`;
};
}),
"[project]/src/core/api/admin/customers/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCustomerById",
    ()=>getCustomerById,
    "getCustomers",
    ()=>getCustomers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const getCustomers = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])('/admin/customers');
};
const getCustomerById = async (id)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/customers/${id}`);
};
}),
"[project]/src/core/api/admin/orders/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOrderById",
    ()=>getOrderById,
    "getOrders",
    ()=>getOrders,
    "updateAdminOrderStatus",
    ()=>updateAdminOrderStatus,
    "updateOrderStatus",
    ()=>updateOrderStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const getOrders = async (skip = 0, limit = 100)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/orders?skip=${skip}&limit=${limit}`);
};
const getOrderById = async (id)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/orders/${id}`);
};
const updateOrderStatus = async (id, status)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/admin/orders/${id}/status?status=${status}`, {
        method: "PUT"
    });
};
const updateAdminOrderStatus = updateOrderStatus;
}),
"[project]/src/core/api/user/orders/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkoutOrder",
    ()=>checkoutOrder,
    "getPublicOrderTrack",
    ()=>getPublicOrderTrack,
    "getUserOrderById",
    ()=>getUserOrderById,
    "getUserOrders",
    ()=>getUserOrders,
    "updateOrderStatus",
    ()=>updateOrderStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
;
const getUserOrderById = async (orderId)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/api/v1/orders/${orderId}`, {
        cache: "no-store"
    });
};
const getUserOrders = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])('/api/v1/orders/me/orders', {
        cache: "no-store"
    });
};
const getPublicOrderTrack = async (orderId, email)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/api/v1/orders/track?order_number=${orderId}&email=${encodeURIComponent(email)}`, {
        cache: "no-store"
    });
};
const checkoutOrder = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])('/api/v1/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
const updateOrderStatus = async (orderId, status)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchClient"])(`/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
            status
        })
    });
};
}),
"[project]/src/core/api/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$user$2f$auth$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/user/auth/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$user$2f$products$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/user/products/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$user$2f$categories$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/user/categories/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$admin$2f$auth$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/admin/auth/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$admin$2f$products$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/admin/products/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$admin$2f$categories$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/admin/categories/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$admin$2f$upload$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/admin/upload/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$admin$2f$customers$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/admin/customers/index.ts [app-rsc] (ecmascript)");
// Admin orders — explicit re-exports to avoid collision with user/orders
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$admin$2f$orders$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/admin/orders/index.ts [app-rsc] (ecmascript)");
// User orders
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$user$2f$orders$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/user/orders/index.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/src/components/ProductInteraction.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductInteraction",
    ()=>ProductInteraction
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ProductInteraction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductInteraction() from the server but ProductInteraction is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ProductInteraction.tsx <module evaluation>", "ProductInteraction");
}),
"[project]/src/components/ProductInteraction.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductInteraction",
    ()=>ProductInteraction
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ProductInteraction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductInteraction() from the server but ProductInteraction is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/ProductInteraction.tsx", "ProductInteraction");
}),
"[project]/src/components/ProductInteraction.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductInteraction$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/ProductInteraction.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductInteraction$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/ProductInteraction.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductInteraction$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/Header.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/Header.tsx <module evaluation>", "Header");
}),
"[project]/src/components/Header.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/Header.tsx", "Header");
}),
"[project]/src/components/Header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/Footer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "border-t bg-white py-8 text-center text-sm text-muted-foreground",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "© ",
                        new Date().getFullYear(),
                        " GoatMeat Store. All rights reserved."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Footer.tsx",
                    lineNumber: 5,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 flex justify-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "hover:text-foreground hover:underline",
                            children: "Privacy Policy"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Footer.tsx",
                            lineNumber: 9,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "hover:text-foreground hover:underline",
                            children: "Terms of Service"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Footer.tsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "hover:text-foreground hover:underline",
                            children: "Contact"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Footer.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Footer.tsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 4,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Footer.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/products/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductDetail,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/core/api/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$user$2f$products$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/user/products/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductInteraction$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductInteraction.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
async function generateMetadata(props) {
    const params = await props.params;
    const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$user$2f$products$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductBySlug"])(params.slug);
    if (!product) return {
        title: "Product Not Found"
    };
    return {
        title: `${product.name} - Goat Meat Store`,
        description: product.description
    };
}
async function ProductDetail(props) {
    const params = await props.params;
    const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$user$2f$products$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductBySlug"])(params.slug);
    if (!product) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const getFullImageUrl = (url)=>{
        if (!url) return "/placeholder.jpg";
        if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
        return `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["API_BASE_URL"]}${url.startsWith("/") ? "" : "/"}${url}`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col bg-background font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/src/app/products/[slug]/page.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 py-12 md:py-24 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-12 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative aspect-square md:aspect-4/3 rounded-3xl overflow-hidden bg-gray-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    src: getFullImageUrl(product.image_url),
                                    alt: product.name,
                                    fill: true,
                                    unoptimized: true,
                                    className: "object-cover",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/products/[slug]/page.tsx",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-4xl font-bold font-serif text-[#1a1a1a]",
                                        children: product.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/products/[slug]/page.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-end gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl font-bold text-[#22c55e]",
                                                children: [
                                                    "₦",
                                                    product.price.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/products/[slug]/page.tsx",
                                                lineNumber: 62,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-500 mb-1 font-medium text-lg",
                                                children: [
                                                    "/ ",
                                                    product.category === "kg" ? "kg" : "unit"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/products/[slug]/page.tsx",
                                                lineNumber: 65,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/products/[slug]/page.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg text-gray-700 leading-relaxed mb-6",
                                                children: product.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/products/[slug]/page.tsx",
                                                lineNumber: 71,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t pt-6",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductInteraction$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductInteraction"], {
                                                    product: product
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/products/[slug]/page.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/products/[slug]/page.tsx",
                                                lineNumber: 74,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/products/[slug]/page.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/products/[slug]/page.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/products/[slug]/page.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/products/[slug]/page.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/products/[slug]/page.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                fileName: "[project]/src/app/products/[slug]/page.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/products/[slug]/page.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/products/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/products/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__67707905._.js.map