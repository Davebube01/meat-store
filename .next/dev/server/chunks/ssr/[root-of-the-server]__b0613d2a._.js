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
"[project]/src/app/admin/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/admin/(dashboard)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(dashboard)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/data/customers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "customers",
    ()=>customers
]);
const customers = [
    {
        id: "CUST-001",
        name: "Chimdiebube Sydani",
        email: "chimdiebube@example.com",
        phone: "+234 801 234 5678",
        address: "123 Lekki Phase 1, Lagos",
        joinDate: "2024-01-15",
        ordersCount: 5,
        totalSpent: 125000
    },
    {
        id: "CUST-002",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+234 802 345 6789",
        address: "45 Victoria Island, Lagos",
        joinDate: "2024-02-01",
        ordersCount: 2,
        totalSpent: 45000
    },
    {
        id: "CUST-003",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+234 803 456 7890",
        address: "78 Ikeja GRA, Lagos",
        joinDate: "2024-02-10",
        ordersCount: 1,
        totalSpent: 15000
    },
    {
        id: "CUST-004",
        name: "Michael Johnson",
        email: "michael.j@example.com",
        phone: "+234 804 567 8901",
        address: "12 Yaba, Lagos",
        joinDate: "2024-02-15",
        ordersCount: 0,
        totalSpent: 0
    }
];
}),
"[project]/src/data/orders.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "orders",
    ()=>orders
]);
// Helper to generate some dummy cart items
const dummyItems = [
    {
        id: "1",
        name: "Full Goat (Live)",
        price: 45000,
        quantity: 1,
        selectedOption: "Full",
        description: "A healthy, full-sized live goat.",
        imageUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80",
        slug: "full-goat-live",
        category: "full",
        weightOptions: [
            "Full"
        ],
        cartId: "1-Full"
    },
    {
        id: "3",
        name: "Goat Leg (Rear)",
        price: 5000,
        quantity: 2,
        selectedOption: "1 leg",
        description: "Meaty rear leg.",
        imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80",
        slug: "goat-leg-rear",
        category: "part",
        weightOptions: [
            "1 leg"
        ],
        cartId: "3-1 leg"
    }
];
const orders = [
    {
        id: "ORD-001",
        customerId: "CUST-001",
        items: [
            dummyItems[0]
        ],
        total: 45000,
        status: "placed",
        date: "2024-02-20T10:00:00Z",
        paymentMethod: "Bank Transfer",
        shippingAddress: "123 Lekki Phase 1, Lagos"
    },
    {
        id: "ORD-002",
        customerId: "CUST-002",
        items: [
            dummyItems[1]
        ],
        total: 10000,
        status: "prepping",
        date: "2024-02-19T14:30:00Z",
        paymentMethod: "Card",
        shippingAddress: "45 Victoria Island, Lagos"
    },
    {
        id: "ORD-003",
        customerId: "CUST-001",
        items: dummyItems,
        total: 55000,
        status: "delivered",
        date: "2024-02-15T09:15:00Z",
        paymentMethod: "Bank Transfer",
        shippingAddress: "123 Lekki Phase 1, Lagos"
    },
    {
        id: "ORD-004",
        customerId: "CUST-003",
        items: [
            dummyItems[0]
        ],
        total: 45000,
        status: "cancelled",
        date: "2024-02-10T16:45:00Z",
        paymentMethod: "Card",
        shippingAddress: "78 Ikeja GRA, Lagos"
    }
];
}),
"[project]/src/components/admin/customers/CustomerProfile.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomerProfile",
    ()=>CustomerProfile
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CustomerProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CustomerProfile() from the server but CustomerProfile is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/admin/customers/CustomerProfile.tsx <module evaluation>", "CustomerProfile");
}),
"[project]/src/components/admin/customers/CustomerProfile.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomerProfile",
    ()=>CustomerProfile
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CustomerProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CustomerProfile() from the server but CustomerProfile is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/admin/customers/CustomerProfile.tsx", "CustomerProfile");
}),
"[project]/src/components/admin/customers/CustomerProfile.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$customers$2f$CustomerProfile$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/admin/customers/CustomerProfile.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$customers$2f$CustomerProfile$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/admin/customers/CustomerProfile.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$customers$2f$CustomerProfile$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/admin/(dashboard)/customers/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/customers.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/orders.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$customers$2f$CustomerProfile$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/customers/CustomerProfile.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function CustomerPage({ params }) {
    const { id } = await params;
    const customer = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$customers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["customers"].find((c)=>c.id === id);
    if (!customer) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const customerOrders = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$orders$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["orders"].filter((o)=>o.customerId === customer.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 space-y-4 p-8 pt-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$customers$2f$CustomerProfile$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CustomerProfile"], {
            customer: customer,
            orders: customerOrders
        }, void 0, false, {
            fileName: "[project]/src/app/admin/(dashboard)/customers/[id]/page.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/(dashboard)/customers/[id]/page.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/admin/(dashboard)/customers/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(dashboard)/customers/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b0613d2a._.js.map