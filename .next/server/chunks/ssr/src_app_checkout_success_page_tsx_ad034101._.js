module.exports=[64958,a=>{"use strict";let b,c;var d,e=a.i(87924),f=a.i(72131),g=a.i(38246),h=a.i(50944),i=a.i(67453),j=a.i(96221),k=a.i(10227),l=a.i(70106);let m=(0,l.default)("party-popper",[["path",{d:"M5.8 11.3 2 22l10.7-3.79",key:"gwxi1d"}],["path",{d:"M4 3h.01",key:"1vcuye"}],["path",{d:"M22 8h.01",key:"1mrtc2"}],["path",{d:"M15 2h.01",key:"1cjtqr"}],["path",{d:"M22 20h.01",key:"1mrys2"}],["path",{d:"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",key:"hbicv8"}],["path",{d:"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17",key:"1i94pl"}],["path",{d:"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7",key:"1cofks"}],["path",{d:"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",key:"4kbmks"}]]);var n=a.i(41710),o=a.i(62722);let p=(0,l.default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);var q=a.i(52495),r=(a.i(1027),a.i(99570)),s=a.i(20238),t=a.i(56283),u=a.i(41923),v=a.i(91761),w=a.i(68114);let x={data:""},y=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,z=/\/\*[^]*?\*\/|  +/g,A=/\n+/g,B=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?B(g,f):f+"{"+B(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=B(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=B.p?B.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},C={},D=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+D(a[c]);return b}return a};function E(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let g=D(a),h=C[g]||(C[g]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(g));if(!C[h]){let b=g!==a?a:(a=>{let b,c,d=[{}];for(;b=y.exec(a.replace(z,""));)b[4]?d.shift():b[3]?(c=b[3].replace(A," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(A," ").trim();return d[0]})(a);C[h]=B(e?{["@keyframes "+h]:b}:b,c?"":"."+h)}let i=c&&C.g?C.g:null;return c&&(C.g=C[h]),f=C[h],i?b.data=b.data.replace(i,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),h})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":B(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||x,d.g,d.o,d.k)}E.bind({g:1});let F,G,H,I=E.bind({k:1});function J(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:G&&G()},h),c.o=/ *go\d+/.test(i),h.className=E.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),H&&j[0]&&H(h),F(j,h)}return b?b(e):e}}var K=(a,b)=>"function"==typeof a?a(b):a,L=(b=0,()=>(++b).toString()),M="default",N=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return N(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},O=[],P={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},Q={},R=(a,b=M)=>{Q[b]=N(Q[b]||P,a),O.forEach(([a,c])=>{a===b&&c(Q[b])})},S=a=>Object.keys(Q).forEach(b=>R(a,b)),T=(a=M)=>b=>{R(b,a)},U=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||L()}))(b,a,c);return T(e.toasterId||(d=e.id,Object.keys(Q).find(a=>Q[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},V=(a,b)=>U("blank")(a,b);V.error=U("error"),V.success=U("success"),V.loading=U("loading"),V.custom=U("custom"),V.dismiss=(a,b)=>{let c={type:3,toastId:a};b?T(b)(c):S(c)},V.dismissAll=a=>V.dismiss(void 0,a),V.remove=(a,b)=>{let c={type:4,toastId:a};b?T(b)(c):S(c)},V.removeAll=a=>V.remove(void 0,a),V.promise=(a,b,c)=>{let d=V.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?K(b.success,a):void 0;return e?V.success(e,{id:d,...c,...null==c?void 0:c.success}):V.dismiss(d),a}).catch(a=>{let e=b.error?K(b.error,a):void 0;e?V.error(e,{id:d,...c,...null==c?void 0:c.error}):V.dismiss(d)}),a};var W=I`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,X=I`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=I`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Z=J("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${W} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${X} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Y} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,$=I`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,_=J("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${$} 1s linear infinite;
`,aa=I`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ab=I`
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
}`,ac=J("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${aa} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ab} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ad=J("div")`
  position: absolute;
`,ae=J("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,af=I`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ag=J("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${af} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ah=({toast:a})=>{let{icon:b,type:c,iconTheme:d}=a;return void 0!==b?"string"==typeof b?f.createElement(ag,null,b):b:"blank"===c?null:f.createElement(ae,null,f.createElement(_,{...d}),"loading"!==c&&f.createElement(ad,null,"error"===c?f.createElement(Z,{...d}):f.createElement(ac,{...d})))},ai=J("div")`
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
`,aj=J("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;f.memo(({toast:a,position:b,style:d,children:e})=>{let g=a.height?((a,b)=>{let d=a.includes("top")?1:-1,[e,f]=c?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*d}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*d}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${I(e)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${I(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},h=f.createElement(ah,{toast:a}),i=f.createElement(aj,{...a.ariaProps},K(a.message,a));return f.createElement(ai,{className:a.className,style:{...g,...d,...a.style}},"function"==typeof e?e({icon:h,message:i}):f.createElement(f.Fragment,null,h,i))}),d=f.createElement,B.p=void 0,F=d,G=void 0,H=void 0,E`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;let ak=[{status:"pending",label:"Order Placed",description:"We received your order",icon:n.Clock,color:"text-amber-600",bgColor:"bg-amber-100"},{status:"processing",label:"Payment Confirmed",description:"Your payment was verified",icon:i.CheckCircle2,color:"text-blue-600",bgColor:"bg-blue-100"},{status:"in_transit",label:"Out for Delivery",description:"Your order is on the way",icon:k.Truck,color:"text-purple-600",bgColor:"bg-purple-100"},{status:"delivered",label:"Delivered",description:"Enjoy your goat meat!",icon:m,color:"text-green-600",bgColor:"bg-green-100"}];function al(){let a=(0,h.useRouter)(),[b,c]=(0,f.useState)(null),[d,l]=(0,f.useState)(null),{guestInfo:n}=(0,v.useCheckoutStore)();(0,f.useEffect)(()=>{let b=new URLSearchParams(window.location.search),d=b.get("id"),e=b.get("ref");d?(c(d),e&&l(e)):a.push("/")},[a]);let{data:x,isLoading:y}=(0,u.useOrderStatus)(b),z=((0,u.useSimulateWebhook)(b),d||x?.payment_reference||null),A=x?.status??"pending",B=(a=>{switch(a){case"pending":case"awaiting_verification":return{icon:j.Loader2,spin:!0,title:"Waiting for payment confirmation…",subtitle:"This usually takes a few seconds. Please don't close this page.",color:"from-amber-50 to-orange-50 border-amber-200",titleColor:"text-amber-800",subtitleColor:"text-amber-600"};case"processing":return{icon:i.CheckCircle2,spin:!1,title:"Payment confirmed! Preparing your order.",subtitle:"Our team is getting your goat meat ready for delivery.",color:"from-blue-50 to-indigo-50 border-blue-200",titleColor:"text-blue-800",subtitleColor:"text-blue-600"};case"in_transit":return{icon:k.Truck,spin:!1,title:"Your order is on the way!",subtitle:"Sit tight — your goat meat will be with you soon.",color:"from-purple-50 to-violet-50 border-purple-200",titleColor:"text-purple-800",subtitleColor:"text-purple-600"};case"delivered":return{icon:m,spin:!1,title:"Order delivered. Enjoy!",subtitle:"Thank you for shopping with us. Bon appétit!",color:"from-green-50 to-emerald-50 border-green-200",titleColor:"text-green-800",subtitleColor:"text-green-600"};case"cancelled":return{icon:o.XCircle,spin:!1,title:"Order was cancelled.",subtitle:"If you believe this is a mistake, please contact support.",color:"from-red-50 to-rose-50 border-red-200",titleColor:"text-red-800",subtitleColor:"text-red-600"};default:return{icon:j.Loader2,spin:!0,title:"Loading order status…",subtitle:"",color:"from-gray-50 to-slate-50 border-gray-200",titleColor:"text-gray-700",subtitleColor:"text-gray-500"}}})(A),C=B.icon,D="awaiting_verification"===A?0:({pending:0,processing:1,in_transit:2,delivered:3})[A]??0;return(0,e.jsxs)("div",{className:"min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-slate-100/60",children:[(0,e.jsx)(s.Header,{}),(0,e.jsxs)("main",{className:"flex-1 container mx-auto px-4 py-10 max-w-2xl flex flex-col gap-6",children:[(0,e.jsxs)("div",{className:(0,w.cn)("rounded-2xl border bg-gradient-to-br p-6 flex items-start gap-4 shadow-sm",B.color),children:[(0,e.jsx)("div",{className:(0,w.cn)("rounded-full p-2.5 shrink-0",B.spin?"bg-amber-200/70":"bg-white/70"),children:(0,e.jsx)(C,{className:(0,w.cn)("h-7 w-7",B.titleColor,B.spin&&"animate-spin")})}),(0,e.jsxs)("div",{className:"min-w-0",children:[(0,e.jsx)("h1",{className:(0,w.cn)("text-xl font-bold leading-snug",B.titleColor),children:B.title}),B.subtitle&&(0,e.jsx)("p",{className:(0,w.cn)("text-sm mt-1 leading-relaxed",B.subtitleColor),children:B.subtitle})]})]}),"cancelled"!==A&&(0,e.jsxs)("div",{className:"bg-white rounded-2xl border border-gray-100 shadow-sm p-6",children:[(0,e.jsx)("h2",{className:"text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6",children:"Order Progress"}),(0,e.jsxs)("div",{className:"relative",children:[(0,e.jsx)("div",{className:"absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100"}),(0,e.jsx)("div",{className:"space-y-6",children:ak.map((a,b)=>{let c=b<D,d=b===D,f=a.icon;return(0,e.jsxs)("div",{className:"flex items-center gap-4 relative",children:[(0,e.jsx)("div",{className:(0,w.cn)("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",c?"border-green-500 bg-green-500 text-white shadow-sm":d?`border-current ${a.bgColor} ${a.color} shadow-md scale-110`:"border-gray-200 bg-white text-gray-300"),children:c?(0,e.jsx)(i.CheckCircle2,{className:"h-5 w-5"}):(0,e.jsx)(f,{className:(0,w.cn)("h-4.5 w-4.5",d&&"animate-pulse")})}),(0,e.jsxs)("div",{className:(0,w.cn)("flex-1 transition-opacity duration-300",!c&&!d&&"opacity-40"),children:[(0,e.jsxs)("p",{className:(0,w.cn)("font-semibold text-sm",c?"text-green-700":d?"text-gray-900":"text-gray-400"),children:[a.label,d&&(0,e.jsx)("span",{className:"ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700",children:"Current"})]}),(0,e.jsx)("p",{className:"text-xs text-gray-400 mt-0.5",children:a.description})]})]},a.status)})})]})]}),(y||x)&&(0,e.jsxs)("div",{className:"bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3",children:[(0,e.jsx)("h2",{className:"text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4",children:"Order Details"}),y&&!x?(0,e.jsxs)("div",{className:"flex items-center gap-3 text-gray-400 py-4",children:[(0,e.jsx)(j.Loader2,{className:"h-4 w-4 animate-spin"}),(0,e.jsx)("span",{className:"text-sm",children:"Loading order info…"})]}):x?(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)("div",{className:"flex justify-between items-center py-2 border-b border-dashed border-gray-100",children:[(0,e.jsx)("span",{className:"text-sm text-gray-500",children:"Order ID"}),(0,e.jsx)("span",{className:"font-mono text-xs font-semibold text-gray-700 truncate max-w-[160px]",children:x.id})]}),(0,e.jsxs)("div",{className:"flex justify-between items-center py-2 border-b border-dashed border-gray-100",children:[(0,e.jsx)("span",{className:"text-sm text-gray-500",children:"Amount"}),(0,e.jsxs)("span",{className:"font-bold text-green-700 text-lg",children:["₦",x.total_amount.toLocaleString()]})]}),(0,e.jsxs)("div",{className:"flex justify-between items-center py-2 border-b border-dashed border-gray-100",children:[(0,e.jsx)("span",{className:"text-sm text-gray-500",children:"Status"}),(0,e.jsx)("span",{className:"capitalize text-sm font-semibold text-gray-700",children:x.status.replace(/_/g," ")})]}),x.paid_at&&(0,e.jsxs)("div",{className:"flex justify-between items-center py-2 border-b border-dashed border-gray-100",children:[(0,e.jsx)("span",{className:"text-sm text-gray-500",children:"Paid at"}),(0,e.jsx)("span",{className:"text-sm font-medium text-gray-700",children:new Date(x.paid_at).toLocaleString()})]}),z&&(0,e.jsxs)("div",{className:"flex justify-between items-center py-2",children:[(0,e.jsx)("span",{className:"text-sm text-gray-500",children:"Payment Ref"}),(0,e.jsxs)("button",{onClick:()=>{z&&(navigator.clipboard.writeText(z),V.success("Reference copied!"))},className:"flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-green-700 transition-colors group",children:[(0,e.jsx)("span",{className:"truncate max-w-[140px]",children:z}),(0,e.jsx)(p,{className:"h-3 w-3 shrink-0 group-hover:scale-110 transition-transform"})]})]})]}):null]}),!1,(0,e.jsxs)("div",{className:"flex flex-col sm:flex-row gap-3",children:[(0,e.jsx)(r.Button,{className:"flex-1 bg-green-700 hover:bg-green-800 shadow-sm",asChild:!0,children:(0,e.jsxs)(g.default,{href:`/order-tracking?id=${b}${n?.email?`&email=${encodeURIComponent(n.email)}`:""}`,children:[(0,e.jsx)(q.ExternalLink,{className:"h-4 w-4 mr-2"}),"Track Order"]})}),(0,e.jsx)(r.Button,{variant:"outline",className:"flex-1 border-gray-200",asChild:!0,children:(0,e.jsx)(g.default,{href:"/products",children:"Continue Shopping"})})]})]}),(0,e.jsx)(t.Footer,{})]})}a.s(["default",()=>al],64958)}];

//# sourceMappingURL=src_app_checkout_success_page_tsx_ad034101._.js.map