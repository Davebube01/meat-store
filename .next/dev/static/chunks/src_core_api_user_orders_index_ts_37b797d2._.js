(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/core/api/user/orders/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkoutOrder",
    ()=>checkoutOrder,
    "getPublicOrderTrack",
    ()=>getPublicOrderTrack,
    "getUserOrderById",
    ()=>getUserOrderById,
    "getUserOrders",
    ()=>getUserOrders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/core/api/client.ts [app-client] (ecmascript)");
;
const getUserOrderById = async (orderId)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchClient"])(`/api/v1/orders/${orderId}`, {
        cache: "no-store"
    });
};
const getUserOrders = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchClient"])('/api/v1/orders/me/orders', {
        cache: "no-store"
    });
};
const getPublicOrderTrack = async (orderId, email)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchClient"])(`/api/v1/orders/track?order_number=${orderId}&email=${encodeURIComponent(email)}`, {
        cache: "no-store"
    });
};
const checkoutOrder = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$core$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchClient"])('/api/v1/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_core_api_user_orders_index_ts_37b797d2._.js.map