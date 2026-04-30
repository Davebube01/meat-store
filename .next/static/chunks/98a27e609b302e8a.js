(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18566,(e,t,r)=>{t.exports=e.r(76562)},13642,e=>{"use strict";var t=e.i(43476);function r(){return(0,t.jsx)("footer",{className:"border-t bg-white py-8 text-center text-sm text-muted-foreground",children:(0,t.jsxs)("div",{className:"container mx-auto px-4",children:[(0,t.jsxs)("p",{children:["© ",new Date().getFullYear()," GoatMeat Store. All rights reserved."]}),(0,t.jsxs)("div",{className:"mt-4 flex justify-center gap-4",children:[(0,t.jsx)("a",{href:"#",className:"hover:text-foreground hover:underline",children:"Privacy Policy"}),(0,t.jsx)("a",{href:"#",className:"hover:text-foreground hover:underline",children:"Terms of Service"}),(0,t.jsx)("a",{href:"#",className:"hover:text-foreground hover:underline",children:"Contact"})]})]})})}e.s(["Footer",()=>r])},3116,e=>{"use strict";let t=(0,e.i(75254).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["Clock",()=>t],3116)},70409,e=>{"use strict";var t=e.i(76166);let r=async e=>(0,t.fetchClient)(`/api/v1/orders/${e}`,{cache:"no-store"}),s=async()=>(0,t.fetchClient)("/api/v1/orders/me/orders",{cache:"no-store"}),i=async(e,r)=>(0,t.fetchClient)(`/api/v1/orders/track?order_number=${e}&email=${encodeURIComponent(r)}`,{cache:"no-store"}),a=async e=>(0,t.fetchClient)("/api/v1/orders/checkout",{method:"POST",body:JSON.stringify(e)}),o=async(e,r)=>(0,t.fetchClient)(`/api/v1/orders/${e}/status`,{method:"PATCH",body:JSON.stringify({status:r})});e.s(["checkoutOrder",0,a,"getPublicOrderTrack",0,i,"getUserOrderById",0,r,"getUserOrders",0,s,"updateOrderStatus",0,o])},15788,e=>{"use strict";let t=(0,e.i(75254).default)("truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]);e.s(["Truck",()=>t],15788)},95468,e=>{"use strict";var t=e.i(23287);e.s(["CheckCircle2",()=>t.default])},44267,e=>{"use strict";var t=e.i(68834),r=e.i(79473);let s={fullName:"",email:"",phone:""},i={deliveryDate:"",address:"",apartment:"",city:"",state:"",landmark:"",instructions:"",deliveryZone:"",deliveryFee:0,timeSlot:""},a=(0,t.create)()((0,r.persist)(e=>({step:1,isGuest:!1,guestInfo:s,deliveryMethod:"delivery",deliveryInfo:i,paymentMethod:"paystack",setStep:t=>e({step:t}),setGuest:t=>e({isGuest:t}),setGuestInfo:t=>e({guestInfo:t}),setDeliveryMethod:t=>e({deliveryMethod:t}),setDeliveryInfo:t=>e({deliveryInfo:t}),setPaymentMethod:t=>e({paymentMethod:t}),clearCheckout:()=>e({step:1,isGuest:!1,guestInfo:s,deliveryMethod:"delivery",deliveryInfo:i,paymentMethod:"paystack"})}),{name:"meat-store-checkout"}));e.s(["useCheckoutStore",0,a])},78917,e=>{"use strict";let t=(0,e.i(75254).default)("external-link",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);e.s(["ExternalLink",()=>t],78917)},73884,e=>{"use strict";let t=(0,e.i(75254).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",()=>t],73884)},18081,e=>{"use strict";var t=e.i(76166);let r=async e=>(0,t.fetchClient)("/api/v1/payments/initialize",{method:"POST",body:JSON.stringify(e)}),s=async e=>(0,t.fetchClient)("/api/v1/payments/webhook/simulate",{method:"POST",body:JSON.stringify({reference:e})});e.s(["initializePayment",0,r,"simulateWebhook",0,s])},39312,e=>{"use strict";let t=(0,e.i(75254).default)("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);e.s(["Zap",()=>t],39312)},7096,e=>{"use strict";let t;var r=e.i(71645),s=e.i(14272),i=e.i(40143),a=e.i(15823),o=e.i(19273),n=class extends a.Subscribable{#e;#t=void 0;#r;#s;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#i()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),(0,o.shallowEqualObjects)(this.options,t)||this.#e.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#r,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,o.hashKey)(t.mutationKey)!==(0,o.hashKey)(this.options.mutationKey)?this.reset():this.#r?.state.status==="pending"&&this.#r.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#r?.removeObserver(this)}onMutationUpdate(e){this.#i(),this.#a(e)}getCurrentResult(){return this.#t}reset(){this.#r?.removeObserver(this),this.#r=void 0,this.#i(),this.#a()}mutate(e,t){return this.#s=t,this.#r?.removeObserver(this),this.#r=this.#e.getMutationCache().build(this.#e,this.options),this.#r.addObserver(this),this.#r.execute(e)}#i(){let e=this.#r?.state??(0,s.getDefaultState)();this.#t={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#a(e){i.notifyManager.batch(()=>{if(this.#s&&this.hasListeners()){let t=this.#t.variables,r=this.#t.context,s={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};if(e?.type==="success"){try{this.#s.onSuccess?.(e.data,t,r,s)}catch(e){Promise.reject(e)}try{this.#s.onSettled?.(e.data,null,t,r,s)}catch(e){Promise.reject(e)}}else if(e?.type==="error"){try{this.#s.onError?.(e.error,t,r,s)}catch(e){Promise.reject(e)}try{this.#s.onSettled?.(void 0,e.error,t,r,s)}catch(e){Promise.reject(e)}}}this.listeners.forEach(e=>{e(this.#t)})})}},l=e.i(12598);function c(e,t){let s=(0,l.useQueryClient)(t),[a]=r.useState(()=>new n(s,e));r.useEffect(()=>{a.setOptions(e)},[a,e]);let c=r.useSyncExternalStore(r.useCallback(e=>a.subscribe(i.notifyManager.batchCalls(e)),[a]),()=>a.getCurrentResult(),()=>a.getCurrentResult()),u=r.useCallback((e,t)=>{a.mutate(e,t).catch(o.noop)},[a]);if(c.error&&(0,o.shouldThrowError)(a.options.throwOnError,[c.error]))throw c.error;return{...c,mutate:u,mutateAsync:c.mutate}}var u=e.i(75555),d=e.i(86491),h=a,p=e.i(93803),m=e.i(80166),f=class extends h.Subscribable{constructor(e,t){super(),this.options=t,this.#e=e,this.#o=null,this.#n=(0,p.pendingThenable)(),this.bindMethods(),this.setOptions(t)}#e;#l=void 0;#c=void 0;#t=void 0;#u;#d;#n;#o;#h;#p;#m;#f;#y;#b;#g=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#l.addObserver(this),y(this.#l,this.options)?this.#x():this.updateResult(),this.#v())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return b(this.#l,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return b(this.#l,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#w(),this.#R(),this.#l.removeObserver(this)}setOptions(e){let t=this.options,r=this.#l;if(this.options=this.#e.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,o.resolveEnabled)(this.options.enabled,this.#l))throw Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#k(),this.#l.setOptions(this.options),t._defaulted&&!(0,o.shallowEqualObjects)(this.options,t)&&this.#e.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#l,observer:this});let s=this.hasListeners();s&&g(this.#l,r,this.options,t)&&this.#x(),this.updateResult(),s&&(this.#l!==r||(0,o.resolveEnabled)(this.options.enabled,this.#l)!==(0,o.resolveEnabled)(t.enabled,this.#l)||(0,o.resolveStaleTime)(this.options.staleTime,this.#l)!==(0,o.resolveStaleTime)(t.staleTime,this.#l))&&this.#C();let i=this.#j();s&&(this.#l!==r||(0,o.resolveEnabled)(this.options.enabled,this.#l)!==(0,o.resolveEnabled)(t.enabled,this.#l)||i!==this.#b)&&this.#O(i)}getOptimisticResult(e){var t,r;let s=this.#e.getQueryCache().build(this.#e,e),i=this.createResult(s,e);return t=this,r=i,(0,o.shallowEqualObjects)(t.getCurrentResult(),r)||(this.#t=i,this.#d=this.options,this.#u=this.#l.state),i}getCurrentResult(){return this.#t}trackResult(e,t){return new Proxy(e,{get:(e,r)=>(this.trackProp(r),t?.(r),"promise"===r&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#n.status||this.#n.reject(Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,r))})}trackProp(e){this.#g.add(e)}getCurrentQuery(){return this.#l}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),r=this.#e.getQueryCache().build(this.#e,t);return r.fetch().then(()=>this.createResult(r,t))}fetch(e){return this.#x({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#t))}#x(e){this.#k();let t=this.#l.fetch(this.options,e);return e?.throwOnError||(t=t.catch(o.noop)),t}#C(){this.#w();let e=(0,o.resolveStaleTime)(this.options.staleTime,this.#l);if(o.isServer||this.#t.isStale||!(0,o.isValidTimeout)(e))return;let t=(0,o.timeUntilStale)(this.#t.dataUpdatedAt,e);this.#f=m.timeoutManager.setTimeout(()=>{this.#t.isStale||this.updateResult()},t+1)}#j(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#l):this.options.refetchInterval)??!1}#O(e){this.#R(),this.#b=e,!o.isServer&&!1!==(0,o.resolveEnabled)(this.options.enabled,this.#l)&&(0,o.isValidTimeout)(this.#b)&&0!==this.#b&&(this.#y=m.timeoutManager.setInterval(()=>{(this.options.refetchIntervalInBackground||u.focusManager.isFocused())&&this.#x()},this.#b))}#v(){this.#C(),this.#O(this.#j())}#w(){this.#f&&(m.timeoutManager.clearTimeout(this.#f),this.#f=void 0)}#R(){this.#y&&(m.timeoutManager.clearInterval(this.#y),this.#y=void 0)}createResult(e,t){let r,s=this.#l,i=this.options,a=this.#t,n=this.#u,l=this.#d,c=e!==s?e.state:this.#c,{state:u}=e,h={...u},m=!1;if(t._optimisticResults){let r=this.hasListeners(),a=!r&&y(e,t),o=r&&g(e,s,t,i);(a||o)&&(h={...h,...(0,d.fetchState)(u.data,e.options)}),"isRestoring"===t._optimisticResults&&(h.fetchStatus="idle")}let{error:f,errorUpdatedAt:b,status:v}=h;r=h.data;let w=!1;if(void 0!==t.placeholderData&&void 0===r&&"pending"===v){let e;a?.isPlaceholderData&&t.placeholderData===l?.placeholderData?(e=a.data,w=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#m?.state.data,this.#m):t.placeholderData,void 0!==e&&(v="success",r=(0,o.replaceData)(a?.data,e,t),m=!0)}if(t.select&&void 0!==r&&!w)if(a&&r===n?.data&&t.select===this.#h)r=this.#p;else try{this.#h=t.select,r=t.select(r),r=(0,o.replaceData)(a?.data,r,t),this.#p=r,this.#o=null}catch(e){this.#o=e}this.#o&&(f=this.#o,r=this.#p,b=Date.now(),v="error");let R="fetching"===h.fetchStatus,k="pending"===v,C="error"===v,j=k&&R,O=void 0!==r,S={status:v,fetchStatus:h.fetchStatus,isPending:k,isSuccess:"success"===v,isError:C,isInitialLoading:j,isLoading:j,data:r,dataUpdatedAt:h.dataUpdatedAt,error:f,errorUpdatedAt:b,failureCount:h.fetchFailureCount,failureReason:h.fetchFailureReason,errorUpdateCount:h.errorUpdateCount,isFetched:h.dataUpdateCount>0||h.errorUpdateCount>0,isFetchedAfterMount:h.dataUpdateCount>c.dataUpdateCount||h.errorUpdateCount>c.errorUpdateCount,isFetching:R,isRefetching:R&&!k,isLoadingError:C&&!O,isPaused:"paused"===h.fetchStatus,isPlaceholderData:m,isRefetchError:C&&O,isStale:x(e,t),refetch:this.refetch,promise:this.#n,isEnabled:!1!==(0,o.resolveEnabled)(t.enabled,e)};if(this.options.experimental_prefetchInRender){let t=void 0!==S.data,r="error"===S.status&&!t,i=e=>{r?e.reject(S.error):t&&e.resolve(S.data)},a=()=>{i(this.#n=S.promise=(0,p.pendingThenable)())},o=this.#n;switch(o.status){case"pending":e.queryHash===s.queryHash&&i(o);break;case"fulfilled":(r||S.data!==o.value)&&a();break;case"rejected":r&&S.error===o.reason||a()}}return S}updateResult(){let e=this.#t,t=this.createResult(this.#l,this.options);if(this.#u=this.#l.state,this.#d=this.options,void 0!==this.#u.data&&(this.#m=this.#l),(0,o.shallowEqualObjects)(t,e))return;this.#t=t;let r=()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,r="function"==typeof t?t():t;if("all"===r||!r&&!this.#g.size)return!0;let s=new Set(r??this.#g);return this.options.throwOnError&&s.add("error"),Object.keys(this.#t).some(t=>this.#t[t]!==e[t]&&s.has(t))};this.#a({listeners:r()})}#k(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#l)return;let t=this.#l;this.#l=e,this.#c=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#v()}#a(e){i.notifyManager.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#t)}),this.#e.getQueryCache().notify({query:this.#l,type:"observerResultsUpdated"})})}};function y(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&void 0===e.state.data&&("error"!==e.state.status||!1!==t.retryOnMount)||void 0!==e.state.data&&b(e,t,t.refetchOnMount)}function b(e,t,r){if(!1!==(0,o.resolveEnabled)(t.enabled,e)&&"static"!==(0,o.resolveStaleTime)(t.staleTime,e)){let s="function"==typeof r?r(e):r;return"always"===s||!1!==s&&x(e,t)}return!1}function g(e,t,r,s){return(e!==t||!1===(0,o.resolveEnabled)(s.enabled,e))&&(!r.suspense||"error"!==e.state.status)&&x(e,r)}function x(e,t){return!1!==(0,o.resolveEnabled)(t.enabled,e)&&e.isStaleByTime((0,o.resolveStaleTime)(t.staleTime,e))}e.i(47167),e.i(43476);var v=r.createContext((t=!1,{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t})),w=r.createContext(!1);w.Provider;var R=(e,t,r)=>t.fetchOptimistic(e).catch(()=>{r.clearReset()}),k=e.i(70319),C=e.i(18081),j=e.i(70409);let O=["pending","awaiting_verification"];e.s(["useOrderStatus",0,(e,t=!0)=>(function(e,t,s){let a,n=r.useContext(w),c=r.useContext(v),u=(0,l.useQueryClient)(s),d=u.defaultQueryOptions(e);u.getDefaultOptions().queries?._experimental_beforeQuery?.(d);let h=u.getQueryCache().get(d.queryHash);if(d._optimisticResults=n?"isRestoring":"optimistic",d.suspense){let e=e=>"static"===e?e:Math.max(e??1e3,1e3),t=d.staleTime;d.staleTime="function"==typeof t?(...r)=>e(t(...r)):e(t),"number"==typeof d.gcTime&&(d.gcTime=Math.max(d.gcTime,1e3))}a=h?.state.error&&"function"==typeof d.throwOnError?(0,o.shouldThrowError)(d.throwOnError,[h.state.error,h]):d.throwOnError,(d.suspense||d.experimental_prefetchInRender||a)&&!c.isReset()&&(d.retryOnMount=!1),r.useEffect(()=>{c.clearReset()},[c]);let p=!u.getQueryCache().get(d.queryHash),[m]=r.useState(()=>new t(u,d)),f=m.getOptimisticResult(d),y=!n&&!1!==e.subscribed;if(r.useSyncExternalStore(r.useCallback(e=>{let t=y?m.subscribe(i.notifyManager.batchCalls(e)):o.noop;return m.updateResult(),t},[m,y]),()=>m.getCurrentResult(),()=>m.getCurrentResult()),r.useEffect(()=>{m.setOptions(d)},[d,m]),d?.suspense&&f.isPending)throw R(d,m,c);if((({result:e,errorResetBoundary:t,throwOnError:r,query:s,suspense:i})=>e.isError&&!t.isReset()&&!e.isFetching&&s&&(i&&void 0===e.data||(0,o.shouldThrowError)(r,[e.error,s])))({result:f,errorResetBoundary:c,throwOnError:d.throwOnError,query:h,suspense:d.suspense}))throw f.error;if(u.getDefaultOptions().queries?._experimental_afterQuery?.(d,f),d.experimental_prefetchInRender&&!o.isServer&&f.isLoading&&f.isFetching&&!n){let e=p?R(d,m,c):h?.promise;e?.catch(o.noop).finally(()=>{m.updateResult()})}return d.notifyOnChangeProps?f:m.trackResult(f)})({queryKey:["order",e],queryFn:()=>(0,j.getUserOrderById)(e),enabled:!!e&&t,refetchInterval:e=>{let t=e.state.data?.status;return!!(!t||O.includes(t))&&3e3},staleTime:0},f,void 0),"useSimulateWebhook",0,e=>{let t=(0,l.useQueryClient)();return c({mutationFn:e=>(0,C.simulateWebhook)(e),onSuccess:()=>{k.toast.success("Webhook simulated! Refreshing order status..."),t.invalidateQueries({queryKey:["order",e]})},onError:e=>{k.toast.error(`Simulation failed: ${e.message}`)}})},"useUpdateOrderStatus",0,e=>{let t=(0,l.useQueryClient)();return c({mutationFn:t=>(0,j.updateOrderStatus)(e,t),onMutate:async r=>{await t.cancelQueries({queryKey:["order",e]});let s=t.getQueryData(["order",e]);return t.setQueryData(["order",e],e=>e?{...e,status:r}:e),{previous:s}},onError:(r,s,i)=>{t.setQueryData(["order",e],i?.previous),k.toast.error("Failed to update order status.")},onSuccess:()=>{t.invalidateQueries({queryKey:["order",e]}),t.invalidateQueries({queryKey:["admin-orders"]}),k.toast.success("Order status updated.")}})}],7096)},54564,e=>{"use strict";let t,r;e.i(47167);var s,i=e.i(43476),a=e.i(71645),o=e.i(22016),n=e.i(18566),l=e.i(95468),c=e.i(31278),u=e.i(15788),d=e.i(75254);let h=(0,d.default)("party-popper",[["path",{d:"M5.8 11.3 2 22l10.7-3.79",key:"gwxi1d"}],["path",{d:"M4 3h.01",key:"1vcuye"}],["path",{d:"M22 8h.01",key:"1mrtc2"}],["path",{d:"M15 2h.01",key:"1cjtqr"}],["path",{d:"M22 20h.01",key:"1mrys2"}],["path",{d:"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",key:"hbicv8"}],["path",{d:"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17",key:"1i94pl"}],["path",{d:"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7",key:"1cofks"}],["path",{d:"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",key:"4kbmks"}]]);var p=e.i(3116),m=e.i(73884);let f=(0,d.default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);var y=e.i(78917),b=(e.i(39312),e.i(19455)),g=e.i(2971),x=e.i(13642),v=e.i(7096),w=e.i(44267),R=e.i(75157);let k={data:""},C=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,j=/\/\*[^]*?\*\/|  +/g,O=/\n+/g,S=(e,t)=>{let r="",s="",i="";for(let a in e){let o=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+o+";":s+="f"==a[1]?S(o,a):a+"{"+S(o,"k"==a[1]?"":t)+"}":"object"==typeof o?s+=S(o,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):a):null!=o&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=S.p?S.p(a,o):a+":"+o+";")}return r+(t&&i?t+"{"+i+"}":i)+s},E={},Q=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+Q(e[r]);return t}return e};function I(e){let t,r,s=this||{},i=e.call?e(s.p):e;return((e,t,r,s,i)=>{var a;let o=Q(e),n=E[o]||(E[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!E[n]){let t=o!==e?e:(e=>{let t,r,s=[{}];for(;t=C.exec(e.replace(j,""));)t[4]?s.shift():t[3]?(r=t[3].replace(O," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(O," ").trim();return s[0]})(e);E[n]=S(i?{["@keyframes "+n]:t}:t,r?"":"."+n)}let l=r&&E.g?E.g:null;return r&&(E.g=E[n]),a=E[n],l?t.data=t.data.replace(l,a):-1===t.data.indexOf(a)&&(t.data=s?a+t.data:t.data+a),n})(i.unshift?i.raw?(t=[].slice.call(arguments,1),r=s.p,i.reduce((e,s,i)=>{let a=t[i];if(a&&a.call){let e=a(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?"."+t:e&&"object"==typeof e?e.props?"":S(e,""):!1===e?"":e}return e+s+(null==a?"":a)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||k})(s.target),s.g,s.o,s.k)}I.bind({g:1});let T,N,M,P=I.bind({k:1});function D(e,t){let r=this||{};return function(){let s=arguments;function i(a,o){let n=Object.assign({},a),l=n.className||i.className;r.p=Object.assign({theme:N&&N()},n),r.o=/ *go\d+/.test(l),n.className=I.apply(r,s)+(l?" "+l:""),t&&(n.ref=o);let c=e;return e[0]&&(c=n.as||e,delete n.as),M&&c[0]&&M(n),T(c,n)}return t?t(i):i}}var F=(e,t)=>"function"==typeof e?e(t):e,_=(t=0,()=>(++t).toString()),U="default",$=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return $(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},q=[],L={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},A={},z=(e,t=U)=>{A[t]=$(A[t]||L,e),q.forEach(([e,r])=>{e===t&&r(A[t])})},K=e=>Object.keys(A).forEach(t=>z(e,t)),W=(e=U)=>t=>{z(t,e)},H=e=>(t,r)=>{let s,i=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||_()}))(t,e,r);return W(i.toasterId||(s=i.id,Object.keys(A).find(e=>A[e].toasts.some(e=>e.id===s))))({type:2,toast:i}),i.id},B=(e,t)=>H("blank")(e,t);B.error=H("error"),B.success=H("success"),B.loading=H("loading"),B.custom=H("custom"),B.dismiss=(e,t)=>{let r={type:3,toastId:e};t?W(t)(r):K(r)},B.dismissAll=e=>B.dismiss(void 0,e),B.remove=(e,t)=>{let r={type:4,toastId:e};t?W(t)(r):K(r)},B.removeAll=e=>B.remove(void 0,e),B.promise=(e,t,r)=>{let s=B.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?F(t.success,e):void 0;return i?B.success(i,{id:s,...r,...null==r?void 0:r.success}):B.dismiss(s),e}).catch(e=>{let i=t.error?F(t.error,e):void 0;i?B.error(i,{id:s,...r,...null==r?void 0:r.error}):B.dismiss(s)}),e};var V=P`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,G=P`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,J=P`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Y=D("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${J} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Z=P`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,X=D("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Z} 1s linear infinite;
`,ee=P`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,et=P`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,er=D("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ee} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${et} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,es=D("div")`
  position: absolute;
`,ei=D("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ea=P`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,eo=D("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ea} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,en=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?a.createElement(eo,null,t):t:"blank"===r?null:a.createElement(ei,null,a.createElement(X,{...s}),"loading"!==r&&a.createElement(es,null,"error"===r?a.createElement(Y,{...s}):a.createElement(er,{...s})))},el=D("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ec=D("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;a.memo(({toast:e,position:t,style:s,children:i})=>{let o=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[i,a]=(()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${P(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${P(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=a.createElement(en,{toast:e}),l=a.createElement(ec,{...e.ariaProps},F(e.message,e));return a.createElement(el,{className:e.className,style:{...o,...s,...e.style}},"function"==typeof i?i({icon:n,message:l}):a.createElement(a.Fragment,null,n,l))}),s=a.createElement,S.p=void 0,T=s,N=void 0,M=void 0,I`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;let eu=[{status:"pending",label:"Order Placed",description:"We received your order",icon:p.Clock,color:"text-amber-600",bgColor:"bg-amber-100"},{status:"processing",label:"Payment Confirmed",description:"Your payment was verified",icon:l.CheckCircle2,color:"text-blue-600",bgColor:"bg-blue-100"},{status:"in_transit",label:"Out for Delivery",description:"Your order is on the way",icon:u.Truck,color:"text-purple-600",bgColor:"bg-purple-100"},{status:"delivered",label:"Delivered",description:"Enjoy your goat meat!",icon:h,color:"text-green-600",bgColor:"bg-green-100"}];function ed(){let e=(0,n.useRouter)(),[t,r]=(0,a.useState)(null),[s,d]=(0,a.useState)(null),{guestInfo:p}=(0,w.useCheckoutStore)();(0,a.useEffect)(()=>{let t=new URLSearchParams(window.location.search),s=t.get("id"),i=t.get("ref");s?(r(s),i&&d(i)):e.push("/")},[e]);let{data:k,isLoading:C}=(0,v.useOrderStatus)(t),j=((0,v.useSimulateWebhook)(t),s||k?.payment_reference||null),O=k?.status??"pending",S=(e=>{switch(e){case"pending":case"awaiting_verification":return{icon:c.Loader2,spin:!0,title:"Waiting for payment confirmation…",subtitle:"This usually takes a few seconds. Please don't close this page.",color:"from-amber-50 to-orange-50 border-amber-200",titleColor:"text-amber-800",subtitleColor:"text-amber-600"};case"processing":return{icon:l.CheckCircle2,spin:!1,title:"Payment confirmed! Preparing your order.",subtitle:"Our team is getting your goat meat ready for delivery.",color:"from-blue-50 to-indigo-50 border-blue-200",titleColor:"text-blue-800",subtitleColor:"text-blue-600"};case"in_transit":return{icon:u.Truck,spin:!1,title:"Your order is on the way!",subtitle:"Sit tight — your goat meat will be with you soon.",color:"from-purple-50 to-violet-50 border-purple-200",titleColor:"text-purple-800",subtitleColor:"text-purple-600"};case"delivered":return{icon:h,spin:!1,title:"Order delivered. Enjoy!",subtitle:"Thank you for shopping with us. Bon appétit!",color:"from-green-50 to-emerald-50 border-green-200",titleColor:"text-green-800",subtitleColor:"text-green-600"};case"cancelled":return{icon:m.XCircle,spin:!1,title:"Order was cancelled.",subtitle:"If you believe this is a mistake, please contact support.",color:"from-red-50 to-rose-50 border-red-200",titleColor:"text-red-800",subtitleColor:"text-red-600"};default:return{icon:c.Loader2,spin:!0,title:"Loading order status…",subtitle:"",color:"from-gray-50 to-slate-50 border-gray-200",titleColor:"text-gray-700",subtitleColor:"text-gray-500"}}})(O),E=S.icon,Q="awaiting_verification"===O?0:({pending:0,processing:1,in_transit:2,delivered:3})[O]??0;return(0,i.jsxs)("div",{className:"min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100/60",children:[(0,i.jsx)(g.Header,{}),(0,i.jsxs)("main",{className:"flex-1 container mx-auto px-4 py-10 max-w-2xl flex flex-col gap-6",children:[(0,i.jsxs)("div",{className:(0,R.cn)("rounded-2xl border bg-gradient-to-br p-6 flex items-start gap-4 shadow-sm",S.color),children:[(0,i.jsx)("div",{className:(0,R.cn)("rounded-full p-2.5 shrink-0",S.spin?"bg-amber-200/70":"bg-white/70"),children:(0,i.jsx)(E,{className:(0,R.cn)("h-7 w-7",S.titleColor,S.spin&&"animate-spin")})}),(0,i.jsxs)("div",{className:"min-w-0",children:[(0,i.jsx)("h1",{className:(0,R.cn)("text-xl font-bold leading-snug",S.titleColor),children:S.title}),S.subtitle&&(0,i.jsx)("p",{className:(0,R.cn)("text-sm mt-1 leading-relaxed",S.subtitleColor),children:S.subtitle})]})]}),"cancelled"!==O&&(0,i.jsxs)("div",{className:"bg-white rounded-2xl border border-gray-100 shadow-sm p-6",children:[(0,i.jsx)("h2",{className:"text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6",children:"Order Progress"}),(0,i.jsxs)("div",{className:"relative",children:[(0,i.jsx)("div",{className:"absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100"}),(0,i.jsx)("div",{className:"space-y-6",children:eu.map((e,t)=>{let r=t<Q,s=t===Q,a=e.icon;return(0,i.jsxs)("div",{className:"flex items-center gap-4 relative",children:[(0,i.jsx)("div",{className:(0,R.cn)("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",r?"border-green-500 bg-green-500 text-white shadow-sm":s?`border-current ${e.bgColor} ${e.color} shadow-md scale-110`:"border-gray-200 bg-white text-gray-300"),children:r?(0,i.jsx)(l.CheckCircle2,{className:"h-5 w-5"}):(0,i.jsx)(a,{className:(0,R.cn)("h-4.5 w-4.5",s&&"animate-pulse")})}),(0,i.jsxs)("div",{className:(0,R.cn)("flex-1 transition-opacity duration-300",!r&&!s&&"opacity-40"),children:[(0,i.jsxs)("p",{className:(0,R.cn)("font-semibold text-sm",r?"text-green-700":s?"text-gray-900":"text-gray-400"),children:[e.label,s&&(0,i.jsx)("span",{className:"ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700",children:"Current"})]}),(0,i.jsx)("p",{className:"text-xs text-gray-400 mt-0.5",children:e.description})]})]},e.status)})})]})]}),(C||k)&&(0,i.jsxs)("div",{className:"bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3",children:[(0,i.jsx)("h2",{className:"text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4",children:"Order Details"}),C&&!k?(0,i.jsxs)("div",{className:"flex items-center gap-3 text-gray-400 py-4",children:[(0,i.jsx)(c.Loader2,{className:"h-4 w-4 animate-spin"}),(0,i.jsx)("span",{className:"text-sm",children:"Loading order info…"})]}):k?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("div",{className:"flex justify-between items-center py-2 border-b border-dashed border-gray-100",children:[(0,i.jsx)("span",{className:"text-sm text-gray-500",children:"Order ID"}),(0,i.jsx)("span",{className:"font-mono text-xs font-semibold text-gray-700 truncate max-w-[160px]",children:k.id})]}),(0,i.jsxs)("div",{className:"flex justify-between items-center py-2 border-b border-dashed border-gray-100",children:[(0,i.jsx)("span",{className:"text-sm text-gray-500",children:"Amount"}),(0,i.jsxs)("span",{className:"font-bold text-green-700 text-lg",children:["₦",k.total_amount.toLocaleString()]})]}),(0,i.jsxs)("div",{className:"flex justify-between items-center py-2 border-b border-dashed border-gray-100",children:[(0,i.jsx)("span",{className:"text-sm text-gray-500",children:"Status"}),(0,i.jsx)("span",{className:"capitalize text-sm font-semibold text-gray-700",children:k.status.replace(/_/g," ")})]}),k.paid_at&&(0,i.jsxs)("div",{className:"flex justify-between items-center py-2 border-b border-dashed border-gray-100",children:[(0,i.jsx)("span",{className:"text-sm text-gray-500",children:"Paid at"}),(0,i.jsx)("span",{className:"text-sm font-medium text-gray-700",children:new Date(k.paid_at).toLocaleString()})]}),j&&(0,i.jsxs)("div",{className:"flex justify-between items-center py-2",children:[(0,i.jsx)("span",{className:"text-sm text-gray-500",children:"Payment Ref"}),(0,i.jsxs)("button",{onClick:()=>{j&&(navigator.clipboard.writeText(j),B.success("Reference copied!"))},className:"flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-green-700 transition-colors group",children:[(0,i.jsx)("span",{className:"truncate max-w-[140px]",children:j}),(0,i.jsx)(f,{className:"h-3 w-3 shrink-0 group-hover:scale-110 transition-transform"})]})]})]}):null]}),!1,(0,i.jsxs)("div",{className:"flex flex-col sm:flex-row gap-3",children:[(0,i.jsx)(b.Button,{className:"flex-1 bg-green-700 hover:bg-green-800 shadow-sm",asChild:!0,children:(0,i.jsxs)(o.default,{href:`/order-tracking?id=${t}${p?.email?`&email=${encodeURIComponent(p.email)}`:""}`,children:[(0,i.jsx)(y.ExternalLink,{className:"h-4 w-4 mr-2"}),"Track Order"]})}),(0,i.jsx)(b.Button,{variant:"outline",className:"flex-1 border-gray-200",asChild:!0,children:(0,i.jsx)(o.default,{href:"/products",children:"Continue Shopping"})})]})]}),(0,i.jsx)(x.Footer,{})]})}e.s(["default",()=>ed],54564)}]);