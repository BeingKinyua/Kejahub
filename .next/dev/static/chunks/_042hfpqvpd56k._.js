(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
(()=>{"use strict";return[
"[project]/node_modules/next/dist/client/components/bfcache-state-manager.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRouterBFCache", {
    enumerable: true,
    get: function() {
        return useRouterBFCache;
    }
});
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// When the flag is disabled, only track the currently active tree
const MAX_BF_CACHE_ENTRIES = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 1;
function useRouterBFCache(activeTree, activeRenderTree, activeStateKey) {
    // The currently active entry. The entries form a linked list, sorted in
    // order of most recently active. This allows us to reuse parts of the list
    // without cloning, unless there's a reordering or removal.
    // TODO: Once we start tracking back/forward history at each route level,
    // we should use the history order instead. In other words, when traversing
    // to an existing entry as a result of a popstate event, we should maintain
    // the existing order instead of moving it to the front of the list. I think
    // an initial implementation of this could be to pass an incrementing id
    // to history.pushState/replaceState, then use that here for ordering.
    const [prevActiveEntry, setPrevActiveEntry] = (0, _react.useState)(()=>{
        const initialEntry = {
            tree: activeTree,
            renderTree: activeRenderTree,
            stateKey: activeStateKey,
            next: null
        };
        return initialEntry;
    });
    if (prevActiveEntry.tree === activeTree) {
        // Fast path. The active tree hasn't changed, so we can reuse the
        // existing state.
        return prevActiveEntry;
    }
    // The route tree changed. Note that this doesn't mean that the tree changed
    // *at this level* — the change may be due to a child route. Either way, we
    // need to either add or update the router tree in the bfcache.
    //
    // The rest of the code looks more complicated than it actually is because we
    // can't mutate the state in place; we have to copy-on-write.
    // Create a new entry for the active cache key. This is the head of the new
    // linked list.
    const newActiveEntry = {
        tree: activeTree,
        renderTree: activeRenderTree,
        stateKey: activeStateKey,
        next: null
    };
    // We need to append the old list onto the new list. If the head of the new
    // list was already present in the cache, then we'll need to clone everything
    // that came before it. Then we can reuse the rest.
    let n = 1;
    let oldEntry = prevActiveEntry;
    let clonedEntry = newActiveEntry;
    while(oldEntry !== null && n < MAX_BF_CACHE_ENTRIES){
        if (oldEntry.stateKey === activeStateKey) {
            // Fast path. This entry in the old list that corresponds to the key that
            // is now active. We've already placed a clone of this entry at the front
            // of the new list. We can reuse the rest of the old list without cloning.
            // NOTE: We don't need to worry about eviction in this case because we
            // haven't increased the size of the cache, and we assume the max size
            // is constant across renders. If we were to change it to a dynamic limit,
            // then the implementation would need to account for that.
            clonedEntry.next = oldEntry.next;
            break;
        } else {
            // Clone the entry and append it to the list.
            n++;
            const entry = {
                tree: oldEntry.tree,
                renderTree: oldEntry.renderTree,
                stateKey: oldEntry.stateKey,
                next: null
            };
            clonedEntry.next = entry;
            clonedEntry = entry;
        }
        oldEntry = oldEntry.next;
    }
    setPrevActiveEntry(newActiveEntry);
    return newActiveEntry;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/client-boundary-params.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Browser variant of `./client-boundary-params`. In the browser the params and
// searchParams are created at render time rather than dynamically tracked.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createClientParams: null,
    createClientSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createClientParams: function() {
        return _paramsbrowser.createRenderParamsFromClient;
    },
    createClientSearchParams: function() {
        return _searchparamsbrowser.createRenderSearchParamsFromClient;
    }
});
const _paramsbrowser = __turbopack_context__.r("[project]/node_modules/next/dist/client/request/params.browser.js [app-client] (ecmascript)");
const _searchparamsbrowser = __turbopack_context__.r("[project]/node_modules/next/dist/client/request/search-params.browser.js [app-client] (ecmascript)");
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/client-page.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClientPageRoot", {
    enumerable: true,
    get: function() {
        return ClientPageRoot;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/node_modules/next/dist/client/route-params.js [app-client] (ecmascript)");
const _hooksclientcontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js [app-client] (ecmascript)");
const _clientboundaryparams = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/client-boundary-params.browser.js [app-client] (ecmascript)");
function ClientPageRoot({ Component, serverProvidedParams }) {
    let searchParams;
    let params;
    if (serverProvidedParams !== null) {
        searchParams = serverProvidedParams.searchParams;
        params = serverProvidedParams.params;
    } else {
        // When Cache Components is enabled, the server does not pass the params as
        // props; they are parsed on the client and passed via context.
        const layoutRouterContext = (0, _react.use)(_approutercontextsharedruntime.LayoutRouterContext);
        params = layoutRouterContext !== null ? layoutRouterContext.parentParams : {};
        // This is an intentional behavior change: when Cache Components is enabled,
        // client segments receive the "canonical" search params, not the
        // rewritten ones. Users should either call useSearchParams directly or pass
        // the rewritten ones in from a Server Component.
        // TODO: Log a deprecation error when this object is accessed
        searchParams = (0, _routeparams.urlSearchParamsToParsedUrlQuery)((0, _react.use)(_hooksclientcontextsharedruntime.SearchParamsContext));
    }
    const clientSearchParams = (0, _clientboundaryparams.createClientSearchParams)(searchParams);
    const clientParams = (0, _clientboundaryparams.createClientParams)(params);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
        params: clientParams,
        searchParams: clientSearchParams
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/client-segment.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClientSegmentRoot", {
    enumerable: true,
    get: function() {
        return ClientSegmentRoot;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _clientboundaryparams = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/client-boundary-params.browser.js [app-client] (ecmascript)");
function ClientSegmentRoot({ Component, slots, serverProvidedParams }) {
    let params;
    if (serverProvidedParams !== null) {
        params = serverProvidedParams.params;
    } else {
        // When Cache Components is enabled, the server does not pass the params
        // as props; they are parsed on the client and passed via context.
        const layoutRouterContext = (0, _react.use)(_approutercontextsharedruntime.LayoutRouterContext);
        params = layoutRouterContext !== null ? layoutRouterContext.parentParams : {};
    }
    const clientParams = (0, _clientboundaryparams.createClientParams)(params);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
        ...slots,
        params: clientParams
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/instant-validation/boundary.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    InstantValidationBoundaryContext: null,
    PlaceValidationBoundaryBelowThisLevel: null,
    RenderValidationBoundaryAtThisLevel: null,
    SlotMarker: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    InstantValidationBoundaryContext: function() {
        return _impl.InstantValidationBoundaryContext;
    },
    PlaceValidationBoundaryBelowThisLevel: function() {
        return _impl.PlaceValidationBoundaryBelowThisLevel;
    },
    RenderValidationBoundaryAtThisLevel: function() {
        return _impl.RenderValidationBoundaryAtThisLevel;
    },
    SlotMarker: function() {
        return _impl.SlotMarker;
    }
});
const _impl = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/instant-validation/impl.browser.js [app-client] (ecmascript)");
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/instant-validation/impl.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    InstantValidationBoundaryContext: null,
    PlaceValidationBoundaryBelowThisLevel: null,
    RenderValidationBoundaryAtThisLevel: null,
    SlotMarker: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    InstantValidationBoundaryContext: function() {
        return InstantValidationBoundaryContext;
    },
    PlaceValidationBoundaryBelowThisLevel: function() {
        return PlaceValidationBoundaryBelowThisLevel;
    },
    RenderValidationBoundaryAtThisLevel: function() {
        return RenderValidationBoundaryAtThisLevel;
    },
    SlotMarker: function() {
        return SlotMarker;
    }
});
const InstantValidationBoundaryContext = null;
const PlaceValidationBoundaryBelowThisLevel = null;
const RenderValidationBoundaryAtThisLevel = null;
const SlotMarker = null;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    LoadingBoundaryProvider: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    LoadingBoundaryProvider: function() {
        return LoadingBoundaryProvider;
    },
    /**
 * OuterLayoutRouter handles the current segment as well as <Offscreen> rendering of other segments.
 * It can be rendered next to each other with a different `parallelRouterKey`, allowing for Parallel routes.
 */ default: function() {
        return OuterLayoutRouter;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _unresolvedthenable = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/unresolved-thenable.js [app-client] (ecmascript)");
const _errorboundary = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/error-boundary.js [app-client] (ecmascript)");
const _disablesmoothscroll = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js [app-client] (ecmascript)");
const _redirectboundary = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/redirect-boundary.js [app-client] (ecmascript)");
const _errorboundary1 = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js [app-client] (ecmascript)");
const _boundary = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/instant-validation/boundary.js [app-client] (ecmascript)");
const _createsegmentkey = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/router-reducer/create-segment-key.browser.js [app-client] (ecmascript)");
const _bfcachestatemanager = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/bfcache-state-manager.js [app-client] (ecmascript)");
const _apppaths = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/app-paths.js [app-client] (ecmascript)");
const _hooksclientcontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js [app-client] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/node_modules/next/dist/client/route-params.js [app-client] (ecmascript)");
const _rendertree = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/render-tree.js [app-client] (ecmascript)");
/**
 * Resolve the root scroll padding used by the viewport check.
 *
 * Computed lengths serialize as pixels, but percentages remain relative to
 * the scrollport. Preserve the existing behavior for values that still
 * contain unresolved CSS math.
 */ function getScrollPaddingTopInPixels(htmlElement, viewportHeight) {
    const scrollPaddingTop = getComputedStyle(htmlElement).scrollPaddingTop;
    const value = Number.parseFloat(scrollPaddingTop);
    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }
    if (scrollPaddingTop.endsWith('px')) {
        return value;
    }
    if (scrollPaddingTop.endsWith('%')) {
        return value / 100 * viewportHeight;
    }
    return 0;
}
/**
 * Check where the top corner of the HTMLElement is relative to the usable
 * viewport.
 *
 * Scroll padding is resolved lazily so an empty Fragment does not trigger a
 * computed style read. The caller caches the value for the second check.
 */ function getScrollTargetState(instance, viewportHeight, getScrollPaddingTop) {
    const rects = instance.getClientRects();
    if (rects.length === 0) {
        return 0;
    }
    let elementTop = Number.POSITIVE_INFINITY;
    for(let i = 0; i < rects.length; i++){
        const rect = rects[i];
        if (rect.top < elementTop) {
            elementTop = rect.top;
        }
    }
    return elementTop >= getScrollPaddingTop() && elementTop <= viewportHeight ? 1 : 2;
}
/**
 * Find the DOM node for a hash fragment.
 * If `top` the page has to scroll to the top of the page. This mirrors the browser's behavior.
 * If the hash fragment is an id, the page has to scroll to the element with that id.
 * If the hash fragment is a name, the page has to scroll to the first element with that name.
 */ function getHashFragmentDomNode(hashFragment) {
    // If the hash fragment is `top` the page has to scroll to the top of the page.
    if (hashFragment === 'top') {
        return document.body;
    }
    // If the hash fragment is an id, the page has to scroll to the element with that id.
    return document.getElementById(hashFragment) ?? // If the hash fragment is a name, the page has to scroll to the first element with that name.
    document.getElementsByName(hashFragment)[0] ?? null;
}
/**
 * Uses Fragment refs for scrolling.
 * Does not focus the first host descendant.
 */ function InnerScrollHandler(props) {
    const childrenRef = _react.default.useRef(null);
    (0, _react.useLayoutEffect)(()=>{
        const { scrollRef: scrollHandlerRef, renderTree } = props;
        const scrollRef = scrollHandlerRef.forceScroll ? scrollHandlerRef.scrollRef : renderTree.data.scrollRef;
        if (scrollRef === null || !scrollRef.current) return;
        let instance = null;
        const hashFragment = scrollHandlerRef.hashFragment;
        if (hashFragment) {
            instance = getHashFragmentDomNode(hashFragment);
            if (instance === null) {
                // A missing hash target is still a handled scroll intent. Do not
                // fall back to the route Fragment or leave the intent pending.
                scrollRef.current = false;
                scrollHandlerRef.onlyHashChange = false;
                scrollHandlerRef.hashFragment = null;
                return;
            }
        } else {
            instance = childrenRef.current;
        }
        // If there is no DOM node this layout-router level is skipped. It'll be handled higher-up in the tree.
        if (instance === null) {
            return;
        }
        let didHandleScroll = false;
        (0, _disablesmoothscroll.disableSmoothScrollDuringRouteTransition)(()=>{
            const htmlElement = document.documentElement;
            let viewportHeight = null;
            let initialTargetState = null;
            let scrollPaddingTop = null;
            const getScrollPaddingTop = ()=>{
                if (scrollPaddingTop === null) {
                    // Reuse the style and layout update from the geometry read.
                    scrollPaddingTop = getScrollPaddingTopInPixels(htmlElement, viewportHeight);
                }
                return scrollPaddingTop;
            };
            if (!hashFragment) {
                // Store the current viewport height because reading `clientHeight` causes a reflow,
                // and it won't change during this function.
                viewportHeight = htmlElement.clientHeight;
                initialTargetState = getScrollTargetState(instance, viewportHeight, getScrollPaddingTop);
                // An empty Fragment is not a scroll target. In particular, avoid
                // React's sibling fallback and leave the scroll signal available
                // for another changed segment.
                if (initialTargetState === 0) {
                    return;
                }
            }
            didHandleScroll = true;
            // Mark as scrolled so no other segment scrolls for this navigation.
            scrollRef.current = false;
            // This handler intentionally leaves focus untouched; resetting focus on
            // navigation is deferred.
            // In case of hash scroll, we only need to scroll the element into view
            if (hashFragment) {
                instance.scrollIntoView();
                return;
            }
            // If the element's top edge is already in the viewport, exit early.
            if (initialTargetState === 1) {
                return;
            }
            // Otherwise, try scrolling go the top of the document to be backward compatible with pages
            // scrollIntoView() called on `<html/>` element scrolls horizontally on chrome and firefox (that shouldn't happen)
            // We could use it to scroll horizontally following RTL but that also seems to be broken - it will always scroll left
            // scrollLeft = 0 also seems to ignore RTL and manually checking for RTL is too much hassle so we will scroll just vertically
            htmlElement.scrollTop = 0;
            // Scroll to domNode if domNode is not in viewport when scrolled to top of document
            if (getScrollTargetState(instance, viewportHeight, getScrollPaddingTop) === 2) {
                // Scroll into view doesn't scroll horizontally by default when not needed
                instance.scrollIntoView();
            }
        }, {
            // We will force layout by querying domNode position
            dontForceLayout: true,
            onlyHashChange: scrollHandlerRef.onlyHashChange
        });
        if (!didHandleScroll) {
            return;
        }
        // Mutate after scrolling so that it can be read by `disableSmoothScrollDuringRouteTransition`
        scrollHandlerRef.onlyHashChange = false;
        scrollHandlerRef.hashFragment = null;
    }, // but be prepared for lots of manual testing.
    undefined);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_react.Fragment, {
        ref: childrenRef,
        children: props.children
    });
}
function ScrollHandler({ children, renderTree }) {
    const context = (0, _react.useContext)(_approutercontextsharedruntime.GlobalLayoutRouterContext);
    if (!context) {
        throw new Error('invariant global layout router not mounted');
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(InnerScrollHandler, {
        scrollRef: context.scrollRef,
        renderTree: renderTree,
        children: children
    });
}
/**
 * InnerLayoutRouter handles rendering the provided segment based on the cache.
 */ function InnerLayoutRouter({ tree, segmentPath, debugNameContext, renderTree, params, url, isActive }) {
    const context = (0, _react.useContext)(_approutercontextsharedruntime.GlobalLayoutRouterContext);
    const parentNavPromises = (0, _react.useContext)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
    if (!context) {
        throw new Error('invariant global layout router not mounted');
    }
    // `rsc` represents the renderable node for this segment.
    // If this segment has a `prefetchRsc`, it's the statically prefetched data.
    // We should use that on initial render instead of `rsc`. Then we'll switch
    // to `rsc` when the dynamic response streams in.
    //
    // If no prefetch data is available, then we go straight to rendering `rsc`.
    const resolvedPrefetchRsc = renderTree.data.prefetchRsc !== null ? renderTree.data.prefetchRsc : renderTree.data.rsc;
    // We use `useDeferredValue` to handle switching between the prefetched and
    // final values. The second argument is returned on initial render, then it
    // re-renders with the first argument.
    const rsc = (0, _react.useDeferredValue)(renderTree.data.rsc, resolvedPrefetchRsc);
    // `rsc` is either a React node or a promise for a React node, except we
    // special case `null` to represent that this segment's data is missing. If
    // it's a promise, we need to unwrap it so we can determine whether or not the
    // data is missing.
    let resolvedRsc;
    if ((0, _rendertree.isDeferredRsc)(rsc)) {
        const unwrappedRsc = (0, _react.use)(rsc);
        if (unwrappedRsc === null) {
            // If the promise was resolved to `null`, it means the data for this
            // segment was not returned by the server. Suspend indefinitely. When this
            // happens, the router is responsible for triggering a new state update to
            // un-suspend this segment.
            (0, _react.use)(_unresolvedthenable.unresolvedThenable);
        }
        resolvedRsc = unwrappedRsc;
    } else {
        // This is not a deferred RSC promise. Don't need to unwrap it.
        if (rsc === null) {
            (0, _react.use)(_unresolvedthenable.unresolvedThenable);
        }
        resolvedRsc = rsc;
    }
    // In dev, we create a NavigationPromisesContext containing the instrumented promises that provide
    // `useSelectedLayoutSegment` and `useSelectedLayoutSegments`.
    // Promises are cached outside of render to survive suspense retries.
    let navigationPromises = null;
    if ("TURBOPACK compile-time truthy", 1) {
        const { createNestedLayoutNavigationPromises } = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation-devtools.js [app-client] (ecmascript)");
        navigationPromises = createNestedLayoutNavigationPromises(tree, parentNavPromises);
    }
    let children = resolvedRsc;
    if (navigationPromises) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)(_hooksclientcontextsharedruntime.NavigationPromisesContext.Provider, {
            value: navigationPromises,
            children: resolvedRsc
        });
    }
    children = /*#__PURE__*/ (0, _jsxruntime.jsx)(_approutercontextsharedruntime.LayoutRouterContext.Provider, {
        value: {
            parentTree: tree,
            parentRenderTree: renderTree,
            parentSegmentPath: segmentPath,
            parentParams: params,
            // This is always set to null as we enter a child segment. It's
            // populated by LoadingBoundaryProvider the next time we reach a
            // loading boundary.
            parentLoadingData: null,
            debugNameContext: debugNameContext,
            // TODO-APP: overriding of url for parallel routes
            url: url,
            isActive: isActive
        },
        children: children
    });
    return children;
}
function LoadingBoundaryProvider({ loading, children }) {
    // Provides the data needed to render a loading.tsx boundary, via context.
    //
    // loading.tsx creates a Suspense boundary around each of a layout's child
    // slots. (Might be bit confusing to think about the data flow, but: if
    // loading.tsx and layout.tsx are in the same directory, they are assigned
    // to the same render tree.)
    //
    // This provider component does not render the Suspense boundary directly;
    // that's handled by LoadingBoundary.
    //
    // TODO: For simplicity, we should combine this provider with LoadingBoundary
    // and render the Suspense boundary directly. The only real benefit of doing
    // it separately is so that when there are multiple parallel routes, we only
    // send the boundary data once, rather than once per child. But that's a
    // negligible benefit and can be achieved via caching instead.
    const parentContext = (0, _react.use)(_approutercontextsharedruntime.LayoutRouterContext);
    if (parentContext === null) {
        return children;
    }
    // All values except for parentLoadingData are the same as the parent context.
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_approutercontextsharedruntime.LayoutRouterContext.Provider, {
        value: {
            parentTree: parentContext.parentTree,
            parentRenderTree: parentContext.parentRenderTree,
            parentSegmentPath: parentContext.parentSegmentPath,
            parentParams: parentContext.parentParams,
            parentLoadingData: loading,
            debugNameContext: parentContext.debugNameContext,
            url: parentContext.url,
            isActive: parentContext.isActive
        },
        children: children
    });
}
/**
 * Renders suspense boundary with the provided "loading" property as the fallback.
 * If no loading property is provided it renders the children without a suspense boundary.
 */ function LoadingBoundary({ name, loading, children }) {
    // TODO: For LoadingBoundary, and the other built-in boundary types, don't
    // wrap in an extra function component if no user-defined boundary is
    // provided. In other words, inline this conditional wrapping logic into
    // the parent component. More efficient and keeps unnecessary junk out of
    // the component stack.
    if (loading !== null) {
        const loadingRsc = loading[0];
        const loadingStyles = loading[1];
        const loadingScripts = loading[2];
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(_react.Suspense, {
            name: name,
            fallback: /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
                children: [
                    loadingStyles,
                    loadingScripts,
                    loadingRsc
                ]
            }),
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: children
    });
}
function OuterLayoutRouter({ parallelRouterKey, error, errorStyles, errorScripts, templateStyles, templateScripts, template, notFound, forbidden, unauthorized, segmentViewBoundaries }) {
    const context = (0, _react.useContext)(_approutercontextsharedruntime.LayoutRouterContext);
    if (!context) {
        throw new Error('invariant expected layout router to be mounted');
    }
    const { parentTree, parentRenderTree, parentSegmentPath, parentParams, parentLoadingData, url, isActive, debugNameContext } = context;
    // Get the render tree for this segment by reading it from the parent segment's
    // child map.
    const parentTreeSegment = parentTree[0];
    const segmentPath = parentSegmentPath === null ? // the code. We should clean this up.
    [
        parallelRouterKey
    ] : parentSegmentPath.concat([
        parentTreeSegment,
        parallelRouterKey
    ]);
    // The "state" key of a segment is the one passed to React. In the browser it
    // represents the identity of the UI tree. Whenever the state key changes,
    // the tree is recreated and the state is reset. In the App Router model,
    // search params do not cause state to be lost, so two segments with the same
    // segment path but different search params should have the same state key.
    // On the server, the key describes the segment's structure instead, so it
    // stays the same when unknown params become known during HTML resume.
    //
    // Whether the data can be reused is tracked separately, by the segment
    // cache's vary paths.
    const activeTree = parentTree[1][parallelRouterKey];
    const activeRenderTree = parentRenderTree.slots?.get(parallelRouterKey);
    if (activeTree === undefined || activeRenderTree === undefined) {
        // Could not find a matching segment. The client tree is inconsistent with
        // the server tree. Suspend indefinitely; the router will have already
        // detected the inconsistency when handling the server response, and
        // triggered a refresh of the page to recover.
        (0, _react.use)(_unresolvedthenable.unresolvedThenable);
    }
    let maybeValidationBoundaryId = null;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const activeSegment = activeTree[0];
    const activeStateKey = (0, _createsegmentkey.createSegmentKey)(activeSegment);
    // At each level of the route tree, not only do we render the currently
    // active segment — we also render the last N segments that were active at
    // this level inside a hidden <Activity> boundary, to preserve their state
    // if or when the user navigates to them again.
    //
    // bfcacheEntry is a linked list of FlightRouterStates.
    let bfcacheEntry = (0, _bfcachestatemanager.useRouterBFCache)(activeTree, activeRenderTree, activeStateKey);
    let children = [];
    do {
        const tree = bfcacheEntry.tree;
        const renderTree = bfcacheEntry.renderTree;
        const stateKey = bfcacheEntry.stateKey;
        const segment = tree[0];
        /*
    - Error boundary
      - Only renders error boundary if error component is provided.
      - Rendered for each segment to ensure they have their own error state.
      - When gracefully degrade for bots, skip rendering error boundary.
    - Loading boundary
      - Only renders suspense boundary if loading components is provided.
      - Rendered for each segment to ensure they have their own loading state.
      - Passed to the router during rendering to ensure it can be immediately rendered when suspending on a Flight fetch.
  */ let segmentBoundaryTriggerNode = null;
        let segmentViewStateNode = null;
        if ("TURBOPACK compile-time truthy", 1) {
            const { SegmentBoundaryTriggerNode, SegmentViewStateNode } = __turbopack_context__.r("[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)");
            const pagePrefix = (0, _apppaths.normalizeAppPath)(url);
            segmentViewStateNode = /*#__PURE__*/ (0, _jsxruntime.jsx)(SegmentViewStateNode, {
                page: pagePrefix
            }, pagePrefix);
            segmentBoundaryTriggerNode = /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
                children: /*#__PURE__*/ (0, _jsxruntime.jsx)(SegmentBoundaryTriggerNode, {})
            });
        }
        let params = parentParams;
        if (Array.isArray(segment)) {
            // This segment contains a route param. Accumulate these as we traverse
            // down the router tree. The result represents the set of params that
            // the layout/page components are permitted to access below this point.
            const paramName = segment[0];
            const paramCacheKey = segment[1];
            const paramType = segment[2];
            const paramValue = (0, _routeparams.getParamValueFromCacheKey)(paramCacheKey, paramType);
            if (paramValue !== null) {
                params = {
                    ...parentParams,
                    [paramName]: paramValue
                };
            }
        }
        const debugName = getBoundaryDebugNameFromSegment(segment);
        // `debugNameContext` represents the nearest non-"virtual" parent segment.
        // `getBoundaryDebugNameFromSegment` returns undefined for virtual segments.
        // So if `debugName` is undefined, the context is passed through unchanged.
        const childDebugNameContext = debugName ?? debugNameContext;
        // In practical terms, clicking this name in the Suspense DevTools
        // should select the child slots of that layout.
        //
        // So the name we apply to the Activity boundary is actually based on
        // the nearest parent segments.
        //
        // We skip over "virtual" parents, i.e. ones inserted by Next.js that
        // don't correspond to application-defined code.
        const isVirtual = debugName === undefined;
        const debugNameToDisplay = isVirtual ? undefined : debugNameContext;
        let templateValue = /*#__PURE__*/ (0, _jsxruntime.jsxs)(ScrollHandler, {
            renderTree: renderTree,
            children: [
                /*#__PURE__*/ (0, _jsxruntime.jsx)(_errorboundary.ErrorBoundary, {
                    errorComponent: error,
                    errorStyles: errorStyles,
                    errorScripts: errorScripts,
                    children: /*#__PURE__*/ (0, _jsxruntime.jsx)(LoadingBoundary, {
                        name: debugNameToDisplay,
                        // TODO: The loading module data for a segment is stored on the
                        // parent, then applied to each of that parent segment's
                        // parallel route slots. In the simple case where there's only
                        // one parallel route (the `children` slot), this is no
                        // different from if the loading module data were stored on the
                        // child directly. But I'm not sure this actually makes sense
                        // when there are multiple parallel routes. It's not a huge
                        // issue because you always have the option to define a narrower
                        // loading boundary for a particular slot. But this sort of
                        // smells like an implementation accident to me.
                        loading: parentLoadingData,
                        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_errorboundary1.HTTPAccessFallbackBoundary, {
                            notFound: notFound,
                            forbidden: forbidden,
                            unauthorized: unauthorized,
                            children: /*#__PURE__*/ (0, _jsxruntime.jsxs)(_redirectboundary.RedirectBoundary, {
                                children: [
                                    /*#__PURE__*/ (0, _jsxruntime.jsx)(InnerLayoutRouter, {
                                        url: url,
                                        tree: tree,
                                        params: params,
                                        renderTree: renderTree,
                                        segmentPath: segmentPath,
                                        debugNameContext: childDebugNameContext,
                                        isActive: isActive && stateKey === activeStateKey
                                    }),
                                    segmentBoundaryTriggerNode
                                ]
                            })
                        })
                    })
                }),
                segmentViewStateNode
            ]
        });
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        let child = /*#__PURE__*/ (0, _jsxruntime.jsxs)(_approutercontextsharedruntime.TemplateContext.Provider, {
            value: templateValue,
            children: [
                templateStyles,
                templateScripts,
                template
            ]
        }, stateKey);
        if ("TURBOPACK compile-time truthy", 1) {
            const { SegmentStateProvider } = __turbopack_context__.r("[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)");
            child = /*#__PURE__*/ (0, _jsxruntime.jsxs)(SegmentStateProvider, {
                children: [
                    child,
                    segmentViewBoundaries
                ]
            }, stateKey);
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        children.push(child);
        bfcacheEntry = bfcacheEntry.next;
    }while (bfcacheEntry !== null)
    return children;
}
function getBoundaryDebugNameFromSegment(segment) {
    if (segment === '/') {
        // Reached the root
        return '/';
    }
    if (typeof segment === 'string') {
        if (isVirtualLayout(segment)) {
            return undefined;
        } else {
            return segment + '/';
        }
    }
    const paramCacheKey = segment[1];
    return paramCacheKey + '/';
}
function isVirtualLayout(segment) {
    return(// (like __PAGE__ and __DEFAULT__) to avoid collisions with
    // user-defined route groups.
    segment === '(__SLOT__)');
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return RenderFromTemplateContext;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
function RenderFromTemplateContext() {
    const children = (0, _react.useContext)(_approutercontextsharedruntime.TemplateContext);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: children
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/request/params.browser.dev.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderParamsFromClient;
    }
});
const _reflect = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _reflectutils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)");
const CachedParams = new WeakMap();
function makeDynamicallyTrackedParamsWithDevWarnings(underlyingParams) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const promise = Promise.resolve(underlyingParams);
    const proxiedProperties = new Set();
    Object.keys(underlyingParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (proxiedProperties.has(prop)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('params', prop);
                    warnForSyncAccess(expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return _reflect.ReflectAdapter.set(target, prop, value, receiver);
        },
        ownKeys (target) {
            warnForEnumeration();
            return Reflect.ownKeys(target);
        }
    });
    proxiedPromise.status = 'fulfilled';
    proxiedPromise.value = underlyingParams;
    CachedParams.set(underlyingParams, proxiedPromise);
    return proxiedPromise;
}
function warnForSyncAccess(expression) {
    console.error(`A param property was accessed directly with ${expression}. ` + `\`params\` is a Promise and must be unwrapped with \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`);
}
function warnForEnumeration() {
    console.error(`params are being enumerated. ` + `\`params\` is a Promise and must be unwrapped with \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`);
}
function createRenderParamsFromClient(clientParams) {
    return makeDynamicallyTrackedParamsWithDevWarnings(clientParams);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/request/params.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderParamsFromClient;
    }
});
const createRenderParamsFromClient = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/node_modules/next/dist/client/request/params.browser.dev.js [app-client] (ecmascript)").createRenderParamsFromClient : "TURBOPACK unreachable";
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/request/search-params.browser.dev.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderSearchParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderSearchParamsFromClient;
    }
});
const _reflect = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _reflectutils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)");
const CachedSearchParams = new WeakMap();
function makeUntrackedSearchParamsWithDevWarnings(underlyingSearchParams) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const proxiedProperties = new Set();
    const promise = Promise.resolve(underlyingSearchParams);
    Object.keys(underlyingSearchParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('searchParams', prop);
                    warnForSyncAccess(expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return Reflect.set(target, prop, value, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeHasCheckingStringProperty)('searchParams', prop);
                    warnForSyncAccess(expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            warnForSyncSpread();
            return Reflect.ownKeys(target);
        }
    });
    proxiedPromise.status = 'fulfilled';
    proxiedPromise.value = underlyingSearchParams;
    CachedSearchParams.set(underlyingSearchParams, proxiedPromise);
    return proxiedPromise;
}
function warnForSyncAccess(expression) {
    console.error(`A searchParam property was accessed directly with ${expression}. ` + `\`searchParams\` is a Promise and must be unwrapped with \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`);
}
function warnForSyncSpread() {
    console.error(`The keys of \`searchParams\` were accessed directly. ` + `\`searchParams\` is a Promise and must be unwrapped with \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`);
}
function createRenderSearchParamsFromClient(underlyingSearchParams) {
    return makeUntrackedSearchParamsWithDevWarnings(underlyingSearchParams);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/request/search-params.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderSearchParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderSearchParamsFromClient;
    }
});
const createRenderSearchParamsFromClient = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/node_modules/next/dist/client/request/search-params.browser.dev.js [app-client] (ecmascript)").createRenderSearchParamsFromClient : "TURBOPACK unreachable";
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IconMark", {
    enumerable: true,
    get: function() {
        return IconMark;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const IconMark = ()=>{
    if (typeof window !== 'undefined') {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
        name: "\xabnxt-icon\xbb"
    });
};
}),
"[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReflectAdapter", {
    enumerable: true,
    get: function() {
        return ReflectAdapter;
    }
});
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
}
}),
"[project]/node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Run function with `scroll-behavior: auto` applied to `<html/>`.
 * This css change will be reverted after the function finishes.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "disableSmoothScrollDuringRouteTransition", {
    enumerable: true,
    get: function() {
        return disableSmoothScrollDuringRouteTransition;
    }
});
function disableSmoothScrollDuringRouteTransition(fn, options = {}) {
    // if only the hash is changed, we don't need to disable smooth scrolling
    // we only care to prevent smooth scrolling when navigating to a new page to avoid jarring UX
    if (options.onlyHashChange) {
        fn();
        return;
    }
    const htmlElement = document.documentElement;
    const hasDataAttribute = htmlElement.dataset.scrollBehavior === 'smooth';
    if (!hasDataAttribute) {
        // Warn if smooth scrolling is detected but no data attribute is present
        if (("TURBOPACK compile-time value", "development") === 'development' && getComputedStyle(htmlElement).scrollBehavior === 'smooth') {
            const { warnOnce } = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
            warnOnce('Detected `scroll-behavior: smooth` on the `<html>` element. To disable smooth scrolling during route transitions, ' + 'add `data-scroll-behavior="smooth"` to your <html> element. ' + 'Learn more: https://nextjs.org/docs/messages/missing-data-scroll-behavior');
        }
        // No smooth scrolling configured, run directly without style manipulation
        fn();
        return;
    }
    // Proceed with temporarily disabling smooth scrolling
    const existing = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = 'auto';
    if (!options.dontForceLayout) {
        // In Chrome-based browsers we need to force reflow before calling `scrollTo`.
        // Otherwise it will not pickup the change in scrollBehavior
        // More info here: https://github.com/vercel/next.js/issues/40719#issuecomment-1336248042
        htmlElement.getClientRects();
    }
    fn();
    htmlElement.style.scrollBehavior = existing;
}
}),
"[project]/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This regex will have fast negatives meaning valid identifiers may not pass
// this test. However this is only used during static generation to provide hints
// about why a page bailed out of some or all prerendering and we can use bracket notation
// for example while `ಠ_ಠ` is a valid identifier it's ok to print `searchParams['ಠ_ಠ']`
// even if this would have been fine too `searchParams.ಠ_ಠ`
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    describeHasCheckingStringProperty: null,
    describeStringPropertyAccess: null,
    wellKnownProperties: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    describeHasCheckingStringProperty: function() {
        return describeHasCheckingStringProperty;
    },
    describeStringPropertyAccess: function() {
        return describeStringPropertyAccess;
    },
    wellKnownProperties: function() {
        return wellKnownProperties;
    }
});
const isDefinitelyAValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function describeStringPropertyAccess(target, prop) {
    if (isDefinitelyAValidIdentifier.test(prop)) {
        return `\`${target}.${prop}\``;
    }
    return `\`${target}[${JSON.stringify(prop)}]\``;
}
function describeHasCheckingStringProperty(target, prop) {
    const stringifiedProp = JSON.stringify(prop);
    return `\`Reflect.has(${target}, ${stringifiedProp})\`, \`${stringifiedProp} in ${target}\`, or similar`;
}
const wellKnownProperties = new Set([
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString',
    // Promise prototype
    'then',
    'catch',
    'finally',
    // React Promise extension
    'status',
    // 'value',
    // 'error',
    // React introspection
    'displayName',
    '_debugInfo',
    // Common tested properties
    'toJSON',
    '$$typeof',
    '__esModule',
    // Tested by flight when checking for iterables
    '@@iterator'
]);
}),
"[project]/src/context/PropertyContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PropertyProvider",
    ()=>PropertyProvider,
    "defaultDemoLandlord",
    ()=>defaultDemoLandlord,
    "defaultOnboardingData",
    ()=>defaultOnboardingData,
    "defaultUnauthenticatedUser",
    ()=>defaultUnauthenticatedUser,
    "useProperty",
    ()=>useProperty
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/seedData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$propertyMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/propertyMath.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const PropertyContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const STORAGE_KEY = 'kejahub_app_state_v1';
const defaultUnauthenticatedUser = {
    id: '',
    name: '',
    email: '',
    role: 'LANDLORD',
    avatarUrl: undefined,
    isAuthenticated: false,
    onboardingStatus: 'not_started'
};
const defaultDemoLandlord = {
    id: 'usr-demo-david',
    name: 'David Mwangi',
    email: 'david.mwangi@kejahub.co.ke',
    role: 'LANDLORD',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    isAuthenticated: true,
    onboardingStatus: 'completed',
    workspaceId: 'ws-mwangi'
};
const defaultOnboardingData = {
    step: 1,
    status: 'not_started',
    landlordName: '',
    workspaceName: '',
    contactPhone: '+254 712 345 678',
    country: 'Kenya',
    currency: 'KES',
    timezone: 'Africa/Nairobi (EAT)',
    hasExistingProperties: true,
    propertyName: 'Kilimani Heights Apartments',
    propertyLocation: 'Lenana Road, Kilimani',
    propertyCity: 'Nairobi',
    propertyType: 'APARTMENT',
    totalUnitsCount: 8,
    unitNumber: 'A1',
    unitType: '2BR Master Ensuite',
    monthlyRent: 45000,
    serviceCharge: 3500,
    rentDueDay: 5,
    gracePeriodDays: 5,
    lateFeePercentage: 5,
    securityDepositMonths: 1,
    waterChargeType: 'FIXED',
    waterFixedAmount: 1500,
    garbageCharge: 500,
    addTenantNow: true,
    tenantName: 'Wanjiku Kamau',
    tenantPhone: '+254 712 345 678',
    tenantEmail: 'wanjiku.kamau@gmail.com',
    tenantNationalId: '32145678',
    leaseStart: '2026-01-01',
    leaseEnd: '2026-12-31',
    depositAmount: 48500,
    enableMpesa: true,
    mpesaPaybillNumber: '522522',
    mpesaRefFormat: 'Unit Number',
    enableWhatsApp: true,
    whatsappAutoReceipt: true,
    whatsappAutoReminders: true
};
function getStored(key, fallback) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch  {
        return fallback;
    }
}
const PropertyProvider = ({ children })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Theme state
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    // Current user state - defaults to unauthenticated
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultUnauthenticatedUser);
    const [isAuthLoaded, setIsAuthLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Onboarding draft state
    const [onboardingData, setOnboardingData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOnboardingData);
    // Screen & Navigation
    const [currentScreen, setCurrentScreenState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('overview');
    const [selectedPropertyId, setSelectedPropertyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Assistant State
    const [isAssistantOpen, setIsAssistantOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [assistantMessages, setAssistantMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 'init-1',
            sender: 'AGENT',
            text: 'Jambo! I am your Kejahub Property Agent. I assist with property monitoring, M-Pesa rent reconciliation, and WhatsApp communications.',
            timestamp: '12:00 PM'
        }
    ]);
    // Toasts
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const addToast = (type, title, message)=>{
        const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
        setToasts((prev)=>[
                ...prev,
                {
                    id,
                    type,
                    title,
                    message
                }
            ]);
        setTimeout(()=>{
            dismissToast(id);
        }, 4500);
    };
    const dismissToast = (id)=>{
        setToasts((prev)=>prev.filter((t)=>t.id !== id));
    };
    // Main Entities State loaded from storage or seed
    const [properties, setProperties] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialProperties"]);
    const [units, setUnits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialUnits"]);
    const [tenants, setTenants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialTenants"]);
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialTransactions"]);
    const [maintenanceTickets, setMaintenanceTickets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialMaintenanceTickets"]);
    const [expenses, setExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialExpenses"]);
    const [agentTasks, setAgentTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAgentTasks"]);
    const [automationRules, setAutomationRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAutomationRules"]);
    const [auditLogs, setAuditLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAuditLogs"]);
    const [whatsappMessages, setWhatsAppMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialWhatsAppMessages"]);
    const [workspaceConfig, setWorkspaceConfigState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialWorkspaceConfig"]);
    // Sync state from client localStorage after mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const savedTheme = localStorage.getItem('kejahub_theme');
            if (savedTheme) setThemeState(savedTheme);
            const savedUser = getStored('kejahub_user', null);
            if (savedUser && savedUser.isAuthenticated) {
                setCurrentUser(savedUser);
            } else {
                setCurrentUser(defaultUnauthenticatedUser);
            }
            const savedDraft = getStored('kejahub_onboarding_draft', null);
            if (savedDraft) {
                setOnboardingData(savedDraft);
            }
            setProperties(getStored(STORAGE_KEY + '_props', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialProperties"]));
            setUnits(getStored(STORAGE_KEY + '_units', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialUnits"]));
            setTenants(getStored(STORAGE_KEY + '_tenants', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialTenants"]));
            setTransactions(getStored(STORAGE_KEY + '_txs', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialTransactions"]));
            setMaintenanceTickets(getStored(STORAGE_KEY + '_maint', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialMaintenanceTickets"]));
            setExpenses(getStored(STORAGE_KEY + '_exp', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialExpenses"]));
            setAgentTasks(getStored(STORAGE_KEY + '_tasks', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAgentTasks"]));
            setAutomationRules(getStored(STORAGE_KEY + '_rules', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAutomationRules"]));
            setAuditLogs(getStored(STORAGE_KEY + '_logs', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAuditLogs"]));
            setWhatsAppMessages(getStored(STORAGE_KEY + '_wa', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialWhatsAppMessages"]));
            setWorkspaceConfigState(getStored(STORAGE_KEY + '_config', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialWorkspaceConfig"]));
            setIsAuthLoaded(true);
        }
    }["PropertyProvider.useEffect"], []);
    // Sync route pathname with currentScreen
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            if (!pathname) return;
            const clean = pathname.replace(/^\//, '');
            const validScreens = [
                'overview',
                'properties',
                'tenants',
                'payments',
                'maintenance',
                'expenses',
                'reports',
                'agent',
                'settings',
                'onboarding'
            ];
            if (validScreens.includes(clean)) {
                setCurrentScreenState(clean);
            }
        }
    }["PropertyProvider.useEffect"], [
        pathname
    ]);
    const setCurrentScreen = (screen)=>{
        setCurrentScreenState(screen);
        if (router && typeof router.push === 'function') {
            router.push('/' + screen);
        }
    };
    // Apply Theme effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            const root = document.documentElement;
            const isDark = theme === 'dark' || theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            localStorage.setItem('kejahub_theme', theme);
        }
    }["PropertyProvider.useEffect"], [
        theme
    ]);
    // Persist entities
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_props', JSON.stringify(properties));
        }
    }["PropertyProvider.useEffect"], [
        properties
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_units', JSON.stringify(units));
        }
    }["PropertyProvider.useEffect"], [
        units
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_tenants', JSON.stringify(tenants));
        }
    }["PropertyProvider.useEffect"], [
        tenants
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_txs', JSON.stringify(transactions));
        }
    }["PropertyProvider.useEffect"], [
        transactions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_maint', JSON.stringify(maintenanceTickets));
        }
    }["PropertyProvider.useEffect"], [
        maintenanceTickets
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_exp', JSON.stringify(expenses));
        }
    }["PropertyProvider.useEffect"], [
        expenses
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_tasks', JSON.stringify(agentTasks));
        }
    }["PropertyProvider.useEffect"], [
        agentTasks
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_rules', JSON.stringify(automationRules));
        }
    }["PropertyProvider.useEffect"], [
        automationRules
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_logs', JSON.stringify(auditLogs));
        }
    }["PropertyProvider.useEffect"], [
        auditLogs
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_wa', JSON.stringify(whatsappMessages));
        }
    }["PropertyProvider.useEffect"], [
        whatsappMessages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem(STORAGE_KEY + '_config', JSON.stringify(workspaceConfig));
        }
    }["PropertyProvider.useEffect"], [
        workspaceConfig
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PropertyProvider.useEffect": ()=>{
            localStorage.setItem('kejahub_user', JSON.stringify(currentUser));
        }
    }["PropertyProvider.useEffect"], [
        currentUser
    ]);
    const setTheme = (t)=>{
        setThemeState(t);
    };
    const switchRole = (role)=>{
        setCurrentUser((prev)=>({
                ...prev,
                role,
                name: role === 'LANDLORD' ? 'David Mwangi (Landlord)' : role === 'PROPERTY_MANAGER' ? 'Sarah Omondi (Property Manager)' : role === 'FINANCE' ? 'James Mwita (Accountant)' : role === 'MAINTENANCE' ? 'Fundi Patrick (Maintenance Ops)' : 'Jane Doe (Read-Only Auditor)'
            }));
        addToast('INFO', 'Active Role Switched', `Now operating under ${role} permissions.`);
    };
    const signIn = async (email, role = 'LANDLORD', options)=>{
        const isDemo = options?.isDemo || email.includes('david.mwangi') || email.includes('sarah.omondi');
        let user;
        if (isDemo) {
            user = {
                ...defaultDemoLandlord,
                role,
                name: role === 'PROPERTY_MANAGER' ? 'Sarah Omondi (Property Manager)' : 'David Mwangi (Landlord)',
                email: role === 'PROPERTY_MANAGER' ? 'sarah.omondi@kejahub.co.ke' : 'david.mwangi@kejahub.co.ke',
                isAuthenticated: true,
                onboardingStatus: 'completed'
            };
        } else {
            const existingDraft = getStored('kejahub_onboarding_draft', null);
            const isCompleted = workspaceConfig.onboardingCompleted || existingDraft?.status === 'completed';
            user = {
                id: 'usr-' + Math.random().toString(36).substring(2, 9),
                name: email.split('@')[0].replace(/[._-]/g, ' '),
                email,
                role,
                isAuthenticated: true,
                onboardingStatus: isCompleted ? 'completed' : 'in_progress'
            };
        }
        setCurrentUser(user);
        localStorage.setItem('kejahub_user', JSON.stringify(user));
        try {
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    role,
                    isDemo
                })
            });
        } catch  {}
        addToast('SUCCESS', 'Signed In', `Welcome back, ${user.name}`);
        const target = options?.redirectTo || (user.onboardingStatus === 'completed' ? '/overview' : '/onboarding');
        router.push(target);
        return true;
    };
    const signUp = async (name, email, password)=>{
        const newUser = {
            id: 'usr-' + Date.now().toString(36),
            name,
            email,
            role: 'LANDLORD',
            isAuthenticated: true,
            onboardingStatus: 'in_progress',
            workspaceId: 'ws-' + Date.now().toString(36)
        };
        const initialDraft = {
            ...defaultOnboardingData,
            step: 1,
            status: 'in_progress',
            landlordName: name,
            workspaceName: `${name}'s Properties`
        };
        setCurrentUser(newUser);
        setOnboardingData(initialDraft);
        localStorage.setItem('kejahub_user', JSON.stringify(newUser));
        localStorage.setItem('kejahub_onboarding_draft', JSON.stringify(initialDraft));
        try {
            await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
        } catch  {}
        addToast('SUCCESS', 'Account Created', `Welcome to Kejahub, ${name}! Setting up your workspace.`);
        router.push('/onboarding');
        return true;
    };
    const signOut = async ()=>{
        setCurrentUser(defaultUnauthenticatedUser);
        localStorage.removeItem('kejahub_user');
        try {
            await fetch('/api/auth/logout', {
                method: 'POST'
            });
        } catch  {}
        addToast('INFO', 'Signed Out', 'You have been signed out of Kejahub.');
        router.push('/login');
    };
    const updateOnboardingData = (updates)=>{
        setOnboardingData((prev)=>{
            const updated = {
                ...prev,
                ...updates
            };
            localStorage.setItem('kejahub_onboarding_draft', JSON.stringify(updated));
            return updated;
        });
        try {
            fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    onboardingData: updates,
                    isCompleted: false
                })
            });
        } catch  {}
    };
    const completeOnboarding = (finalPayload)=>{
        const data = finalPayload || onboardingData;
        // 1. Add new property to properties
        const propId = 'prop-new-' + Date.now().toString(36);
        const newProperty = {
            id: propId,
            name: data.propertyName || 'My Property Portfolio',
            location: data.propertyLocation || 'Kilimani, Nairobi',
            city: data.propertyCity || 'Nairobi',
            type: data.propertyType || 'APARTMENT',
            totalUnits: data.totalUnitsCount || 6,
            description: 'Configured during landlord onboarding.'
        };
        // 2. Add first unit
        const unitId = 'u-new-' + Date.now().toString(36);
        const newUnit = {
            id: unitId,
            propertyId: propId,
            unitNumber: data.unitNumber || 'A1',
            bedrooms: data.unitType?.toLowerCase().includes('1') ? 1 : 2,
            typeLabel: data.unitType || '2BR Master Ensuite',
            monthlyRent: data.monthlyRent || 45000,
            serviceCharge: data.serviceCharge || 3500,
            waterDepositOrFixed: data.waterFixedAmount || 1500,
            status: data.addTenantNow ? 'OCCUPIED' : 'VACANT'
        };
        // 3. Add initial tenant if requested
        let newTenant = null;
        if (data.addTenantNow && data.tenantName) {
            const tenId = 'ten-new-' + Date.now().toString(36);
            newTenant = {
                id: tenId,
                name: data.tenantName,
                phone: data.tenantPhone || '+254 712 000 000',
                email: data.tenantEmail || 'tenant@property.co.ke',
                nationalIdOrPassport: data.tenantNationalId || '12345678',
                assignedPropertyId: propId,
                assignedUnitId: unitId,
                leaseStart: data.leaseStart || '2026-01-01',
                leaseEnd: data.leaseEnd || '2026-12-31',
                leaseStatus: 'ACTIVE',
                depositAmount: data.depositAmount || 48500
            };
            newUnit.currentTenantId = tenId;
        }
        setProperties((prev)=>[
                newProperty,
                ...prev
            ]);
        setUnits((prev)=>[
                newUnit,
                ...prev
            ]);
        if (newTenant) {
            setTenants((prev)=>[
                    newTenant,
                    ...prev
                ]);
        }
        // 4. Update workspace config
        const updatedConfig = {
            ...workspaceConfig,
            landlordName: data.landlordName || currentUser.name || 'Landlord',
            workspaceName: data.workspaceName || `${data.landlordName || 'Landlord'}'s Properties`,
            rentDueDay: data.rentDueDay || 5,
            gracePeriodDays: data.gracePeriodDays || 5,
            lateFeePercentage: data.lateFeePercentage || 5,
            onboardingCompleted: true,
            onboardingStatus: 'completed',
            onboardingStep: 7,
            mpesaPaybillNumber: data.mpesaPaybillNumber || '522522',
            mpesaAccountRefFormat: 'Unit Number'
        };
        setWorkspaceConfigState(updatedConfig);
        localStorage.setItem(STORAGE_KEY + '_config', JSON.stringify(updatedConfig));
        // 5. Update user state
        const updatedUser = {
            ...currentUser,
            name: data.landlordName || currentUser.name,
            onboardingStatus: 'completed',
            isAuthenticated: true
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('kejahub_user', JSON.stringify(updatedUser));
        // 6. Persist completed onboarding data
        const completedData = {
            ...data,
            status: 'completed',
            step: 7,
            completedAt: new Date().toISOString()
        };
        setOnboardingData(completedData);
        localStorage.setItem('kejahub_onboarding_draft', JSON.stringify(completedData));
        try {
            fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    onboardingData: completedData,
                    isCompleted: true
                })
            });
        } catch  {}
        addToast('SUCCESS', 'Onboarding Complete', `Workspace "${updatedConfig.workspaceName}" is ready.`);
        router.push('/overview');
    };
    const resetDemoData = ()=>{
        setProperties(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialProperties"]);
        setUnits(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialUnits"]);
        setTenants(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialTenants"]);
        setTransactions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialTransactions"]);
        setMaintenanceTickets(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialMaintenanceTickets"]);
        setExpenses(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialExpenses"]);
        setAgentTasks(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAgentTasks"]);
        setAutomationRules(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAutomationRules"]);
        setAuditLogs(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialAuditLogs"]);
        setWhatsAppMessages(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialWhatsAppMessages"]);
        setWorkspaceConfigState(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initialWorkspaceConfig"]);
        addToast('SUCCESS', 'Demo Data Reset', 'Workspace returned to initial Kenyan property dataset.');
    };
    // Authoritative Balance Calculation per tenant
    const getTenantBalance = (tenantId)=>{
        const tenant = tenants.find((t)=>t.id === tenantId);
        if (!tenant) {
            return {
                totalCharges: 0,
                totalPayments: 0,
                balance: 0,
                status: 'PAID',
                daysOverdue: 0
            };
        }
        const unit = units.find((u)=>u.id === tenant.assignedUnitId);
        const monthlyTotal = (unit?.monthlyRent || 0) + (unit?.serviceCharge || 0);
        // Current month charges
        const charges = [
            {
                amount: monthlyTotal
            }
        ];
        const tenantPayments = transactions.filter((tx)=>tx.tenantId === tenantId && (tx.status === 'CONFIRMED' || tx.status === 'RECONCILED'));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$propertyMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTenantBalance"])(charges, tenantPayments, workspaceConfig.rentDueDay);
    };
    // Portfolio KPIs derived authoritatively
    const portfolioMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PropertyProvider.useMemo[portfolioMetrics]": ()=>{
            const filteredUnits = selectedPropertyId ? units.filter({
                "PropertyProvider.useMemo[portfolioMetrics]": (u)=>u.propertyId === selectedPropertyId
            }["PropertyProvider.useMemo[portfolioMetrics]"]) : units;
            const filteredTenants = selectedPropertyId ? tenants.filter({
                "PropertyProvider.useMemo[portfolioMetrics]": (t)=>t.assignedPropertyId === selectedPropertyId
            }["PropertyProvider.useMemo[portfolioMetrics]"]) : tenants;
            const filteredTransactions = selectedPropertyId ? transactions.filter({
                "PropertyProvider.useMemo[portfolioMetrics]": (tx)=>tx.propertyId === selectedPropertyId || !tx.propertyId
            }["PropertyProvider.useMemo[portfolioMetrics]"]) : transactions;
            const totalUnits = filteredUnits.length;
            const occupiedUnits = filteredUnits.filter({
                "PropertyProvider.useMemo[portfolioMetrics]": (u)=>u.status === 'OCCUPIED'
            }["PropertyProvider.useMemo[portfolioMetrics]"]).length;
            const vacantUnits = filteredUnits.filter({
                "PropertyProvider.useMemo[portfolioMetrics]": (u)=>u.status === 'VACANT'
            }["PropertyProvider.useMemo[portfolioMetrics]"]).length;
            const occupancyRate = totalUnits > 0 ? Math.round(occupiedUnits / totalUnits * 100) : 0;
            let expectedRent = 0;
            for (const unit of filteredUnits){
                if (unit.status === 'OCCUPIED') {
                    expectedRent += (unit.monthlyRent || 0) + (unit.serviceCharge || 0);
                }
            }
            let collectedRent = 0;
            for (const tx of filteredTransactions){
                if ((tx.status === 'CONFIRMED' || tx.status === 'RECONCILED') && tx.amount) {
                    // Count confirmed payments for the active portfolio
                    collectedRent += tx.amount;
                }
            }
            const unallocatedTxs = transactions.filter({
                "PropertyProvider.useMemo[portfolioMetrics].unallocatedTxs": (tx)=>tx.status === 'UNALLOCATED'
            }["PropertyProvider.useMemo[portfolioMetrics].unallocatedTxs"]);
            const unallocatedCount = unallocatedTxs.length;
            const unallocatedAmount = unallocatedTxs.reduce({
                "PropertyProvider.useMemo[portfolioMetrics].unallocatedAmount": (sum, tx)=>sum + tx.amount
            }["PropertyProvider.useMemo[portfolioMetrics].unallocatedAmount"], 0);
            const outstandingRent = Math.max(0, expectedRent - collectedRent);
            const pendingMaintenanceCount = maintenanceTickets.filter({
                "PropertyProvider.useMemo[portfolioMetrics]": (m)=>(!selectedPropertyId || m.propertyId === selectedPropertyId) && (m.status === 'NEW' || m.status === 'AWAITING_APPROVAL')
            }["PropertyProvider.useMemo[portfolioMetrics]"]).length;
            return {
                expectedRent,
                collectedRent,
                outstandingRent,
                occupancyRate,
                totalUnits,
                occupiedUnits,
                vacantUnits,
                unallocatedCount,
                unallocatedAmount,
                pendingMaintenanceCount
            };
        }
    }["PropertyProvider.useMemo[portfolioMetrics]"], [
        units,
        tenants,
        transactions,
        maintenanceTickets,
        selectedPropertyId
    ]);
    // Operations
    const addProperty = (newProp)=>{
        const id = 'prop-' + (properties.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
        const created = {
            ...newProp,
            id
        };
        setProperties((prev)=>[
                created,
                ...prev
            ]);
        addToast('SUCCESS', 'Property Added', `${created.name} successfully created.`);
    };
    const updateProperty = (id, updates)=>{
        setProperties((prev)=>prev.map((p)=>p.id === id ? {
                    ...p,
                    ...updates
                } : p));
        addToast('SUCCESS', 'Property Updated', 'Property changes saved.');
    };
    const archiveProperty = (id)=>{
        setProperties((prev)=>prev.map((p)=>p.id === id ? {
                    ...p,
                    archived: true
                } : p));
        addToast('INFO', 'Property Archived', 'Property archived from active portfolio.');
    };
    const addUnit = (newUnit)=>{
        const id = 'u-' + (units.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
        const created = {
            ...newUnit,
            id
        };
        setUnits((prev)=>[
                ...prev,
                created
            ]);
        addToast('SUCCESS', 'Unit Added', `Unit ${created.unitNumber} added to property.`);
    };
    const updateUnit = (id, updates)=>{
        setUnits((prev)=>prev.map((u)=>u.id === id ? {
                    ...u,
                    ...updates
                } : u));
        addToast('SUCCESS', 'Unit Updated', 'Unit details updated.');
    };
    const addTenant = (newTenant, unitId)=>{
        const id = 'ten-' + (tenants.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
        const targetUnitId = unitId || newTenant.assignedUnitId;
        const created = {
            ...newTenant,
            id,
            assignedUnitId: targetUnitId
        };
        setTenants((prev)=>[
                created,
                ...prev
            ]);
        if (targetUnitId) {
            setUnits((prev)=>prev.map((u)=>u.id === targetUnitId ? {
                        ...u,
                        status: 'OCCUPIED',
                        currentTenantId: id
                    } : u));
        }
        addToast('SUCCESS', 'Tenant Registered', `${created.name} assigned to tenancy.`);
    };
    const updateTenant = (id, updates)=>{
        setTenants((prev)=>prev.map((t)=>t.id === id ? {
                    ...t,
                    ...updates
                } : t));
        addToast('SUCCESS', 'Tenant Record Updated');
    };
    const recordPayment = (paymentData)=>{
        const id = 'tx-' + Date.now();
        const receiptNumber = `KEJA-REC-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`;
        const newTx = {
            ...paymentData,
            id,
            receiptNumber
        };
        setTransactions((prev)=>[
                newTx,
                ...prev
            ]);
        // Add audit log
        const log = {
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            actor: currentUser.role === 'LANDLORD' ? 'LANDLORD' : 'PROPERTY_MANAGER',
            action: 'PAYMENT_RECORDED',
            details: `Recorded ${newTx.channel} payment of KES ${newTx.amount.toLocaleString()} (Ref: ${newTx.referenceNumber}).`
        };
        setAuditLogs((prev)=>[
                log,
                ...prev
            ]);
        addToast('SUCCESS', 'Payment Recorded', `Receipt #${receiptNumber} generated.`);
        return newTx;
    };
    const reconcilePayment = (transactionId, tenantId, unitId)=>{
        const tenant = tenants.find((t)=>t.id === tenantId);
        const unit = units.find((u)=>u.id === unitId);
        const tx = transactions.find((t)=>t.id === transactionId);
        if (!tx || !tenant || !unit) {
            addToast('ERROR', 'Reconciliation Failed', 'Required entity not found.');
            return;
        }
        const receiptNumber = tx.receiptNumber || `KEJA-REC-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`;
        setTransactions((prev)=>prev.map((t)=>t.id === transactionId ? {
                    ...t,
                    status: 'RECONCILED',
                    tenantId,
                    unitId,
                    propertyId: unit.propertyId,
                    receiptNumber
                } : t));
        // Add audit log
        const log = {
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            actor: currentUser.role === 'LANDLORD' ? 'LANDLORD' : 'AI_AGENT',
            action: 'PAYMENT_RECONCILED',
            details: `Reconciled ${tx.channel} payment of KES ${tx.amount.toLocaleString()} (Ref: ${tx.referenceNumber}) to ${tenant.name} (${unit.unitNumber}).`
        };
        setAuditLogs((prev)=>[
                log,
                ...prev
            ]);
        // Send automated WhatsApp receipt simulation
        const waMsg = {
            id: 'wa-' + Date.now(),
            tenantId: tenant.id,
            sender: 'AI_AGENT',
            message: `Jambo ${tenant.name}, your payment of KES ${tx.amount.toLocaleString()} (Ref: ${tx.referenceNumber}) has been matched and reconciled to Unit ${unit.unitNumber}. Receipt #${receiptNumber} issued.`,
            timestamp: new Date().toISOString(),
            status: 'DELIVERED',
            isSimulated: true
        };
        setWhatsAppMessages((prev)=>[
                ...prev,
                waMsg
            ]);
        addToast('SUCCESS', 'Payment Reconciled', `Matched KES ${tx.amount.toLocaleString()} to ${tenant.name}. Automated receipt generated.`);
    };
    const createMaintenanceTicket = (ticketData)=>{
        const id = 'maint-' + (maintenanceTickets.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
        const requiresApproval = ticketData.estimatedCost > workspaceConfig.maintenanceApprovalThreshold;
        const initialStatus = requiresApproval ? 'AWAITING_APPROVAL' : ticketData.status || 'NEW';
        const newTicket = {
            ...ticketData,
            id,
            status: initialStatus,
            reportedDate: new Date().toISOString()
        };
        setMaintenanceTickets((prev)=>[
                newTicket,
                ...prev
            ]);
        const log = {
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            actor: 'SYSTEM',
            action: 'TICKET_CREATED',
            details: `New maintenance ticket #${id} created: "${ticketData.title}". ${requiresApproval ? 'Awaiting Landlord approval (> KES 10,000 threshold).' : ''}`
        };
        setAuditLogs((prev)=>[
                log,
                ...prev
            ]);
        addToast('SUCCESS', 'Maintenance Ticket Created', `Ticket #${id} recorded.`);
    };
    const updateMaintenanceStatus = (id, status, notes)=>{
        setMaintenanceTickets((prev)=>prev.map((m)=>m.id === id ? {
                    ...m,
                    status,
                    resolutionNotes: notes || m.resolutionNotes
                } : m));
        addToast('INFO', 'Maintenance Updated', `Ticket status changed to ${status}.`);
    };
    const approveMaintenanceTicket = (id)=>{
        const ticket = maintenanceTickets.find((m)=>m.id === id);
        if (!ticket) return false;
        const safety = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$propertyMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluateAgentActionSafety"])('APPROVE_MAINTENANCE', currentUser.role, ticket.estimatedCost, workspaceConfig.maintenanceApprovalThreshold);
        if (!safety.allowed && safety.requiresLandlordApproval && currentUser.role !== 'LANDLORD') {
            addToast('WARNING', 'Approval Denied', safety.policyReason);
            return false;
        }
        setMaintenanceTickets((prev)=>prev.map((m)=>m.id === id ? {
                    ...m,
                    status: 'ASSIGNED',
                    approvedBy: currentUser.name,
                    approvedAt: new Date().toISOString()
                } : m));
        const log = {
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            actor: currentUser.role === 'LANDLORD' ? 'LANDLORD' : 'PROPERTY_MANAGER',
            action: 'MAINTENANCE_APPROVED',
            details: `Authorized expenditure of KES ${ticket.estimatedCost.toLocaleString()} for ticket #${ticket.id} (${ticket.title}).`
        };
        setAuditLogs((prev)=>[
                log,
                ...prev
            ]);
        addToast('SUCCESS', 'Maintenance Approved', `Authorized KES ${ticket.estimatedCost.toLocaleString()} work order.`);
        return true;
    };
    const addExpense = (expenseData)=>{
        const id = 'exp-' + (expenses.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
        const created = {
            ...expenseData,
            id
        };
        setExpenses((prev)=>[
                created,
                ...prev
            ]);
        addToast('SUCCESS', 'Expense Recorded', `Recorded KES ${created.amount.toLocaleString()} for ${created.description}`);
    };
    const approveAgentTask = (taskId)=>{
        const task = agentTasks.find((t)=>t.id === taskId);
        if (!task) return false;
        // Verify role permissions
        if (task.safetyLevel === 'REQUIRES_APPROVAL' && currentUser.role === 'READ_ONLY') {
            addToast('ERROR', 'Permission Denied', 'Read-only users cannot authorize tasks.');
            return false;
        }
        // Execute task side-effects
        if (task.category === 'RECONCILIATION' || task.id === 'task-1') {
            // Reconcile the unallocated transactions
            reconcilePayment('tx-unalloc-1', 'ten-5', 'u-106');
            reconcilePayment('tx-unalloc-2', 'ten-11', 'u-301');
        } else if (task.category === 'RENT_COLLECTION' || task.id === 'task-2') {
            // Send simulated WhatsApp reminders
            sendWhatsAppMessage('ten-2', 'Jambo Brian, this is a friendly reminder that October rent of KES 48,500 for Unit A2 is due. Paybill 522522, Account A2. Asante.');
            sendWhatsAppMessage('ten-4', 'Jambo Kevin, this is a reminder for October rent balance of KES 48,500 for Unit A4. Paybill 522522, Account A4. Asante.');
            sendWhatsAppMessage('ten-10', 'Jambo Linda, friendly reminder for Sapphire Court Unit 2B rent balance of KES 59,000. Paybill 522522, Account 2B. Thank you.');
        }
        setAgentTasks((prev)=>prev.map((t)=>t.id === taskId ? {
                    ...t,
                    status: 'COMPLETED',
                    completedAt: new Date().toISOString(),
                    planSteps: t.planSteps.map((s)=>({
                            ...s,
                            status: 'DONE'
                        })),
                    resultSummary: 'Executed safely with Landlord authorization.'
                } : t));
        const log = {
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            actor: currentUser.role === 'LANDLORD' ? 'LANDLORD' : 'PROPERTY_MANAGER',
            action: 'TASK_APPROVED_AND_EXECUTED',
            details: `Approved task "${task.title}". Side effects completed successfully.`,
            taskId: task.id
        };
        setAuditLogs((prev)=>[
                log,
                ...prev
            ]);
        addToast('SUCCESS', 'Task Approved & Executed', `AI Agent completed "${task.title}".`);
        return true;
    };
    const rejectAgentTask = (taskId)=>{
        setAgentTasks((prev)=>prev.map((t)=>t.id === taskId ? {
                    ...t,
                    status: 'CANCELLED',
                    resultSummary: 'Cancelled by operator.'
                } : t));
        addToast('INFO', 'Task Cancelled', 'The task was cancelled with no side effects.');
    };
    const executeAgentTaskDirectly = (taskId)=>{
        approveAgentTask(taskId);
    };
    const toggleAutomationRule = (ruleId)=>{
        setAutomationRules((prev)=>prev.map((r)=>r.id === ruleId ? {
                    ...r,
                    enabled: !r.enabled
                } : r));
        addToast('INFO', 'Automation Rule Updated');
    };
    const sendWhatsAppMessage = (tenantId, text)=>{
        const newMsg = {
            id: 'wa-' + Date.now() + Math.random().toString(36).substring(2, 4),
            tenantId,
            sender: 'LANDLORD',
            message: text,
            timestamp: new Date().toISOString(),
            status: 'DELIVERED',
            isSimulated: true
        };
        setWhatsAppMessages((prev)=>[
                ...prev,
                newMsg
            ]);
        addToast('SUCCESS', 'WhatsApp Sent (Simulated)', 'Message dispatched to tenant WhatsApp thread.');
    };
    const updateWorkspaceConfig = (updates)=>{
        setWorkspaceConfigState((prev)=>({
                ...prev,
                ...updates
            }));
        addToast('SUCCESS', 'Settings Updated', 'Workspace configuration saved.');
    };
    // Assistant queries handling
    const sendAssistantMessage = (userText)=>{
        const userMsg = {
            id: 'msg-' + Date.now(),
            sender: 'USER',
            text: userText,
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        setAssistantMessages((prev)=>[
                ...prev,
                userMsg
            ]);
        // Intelligent local deterministic Agent response based on domain intent
        setTimeout(()=>{
            const lower = userText.toLowerCase();
            let responseText = '';
            let suggestedAction;
            if (lower.includes('unallocated') || lower.includes('m-pesa') || lower.includes('mpesa') || lower.includes('match')) {
                const unallocated = transactions.filter((t)=>t.status === 'UNALLOCATED');
                if (unallocated.length > 0) {
                    responseText = `I found ${unallocated.length} unallocated M-Pesa transaction(s) totaling KES ${unallocated.reduce((a, b)=>a + b.amount, 0).toLocaleString()}. I have prepared a reconciliation task matching them to Unit B2 (Fatuma Mohammed) and Villa G1 (John Ngugi). Would you like to review and approve?`;
                    suggestedAction = {
                        label: 'Review in Agent Hub',
                        screen: 'agent'
                    };
                } else {
                    responseText = 'All M-Pesa transactions are currently reconciled. No unallocated funds in the queue.';
                    suggestedAction = {
                        label: 'View Payments Ledger',
                        screen: 'payments'
                    };
                }
            } else if (lower.includes('attention') || lower.includes('summarize') || lower.includes('overview') || lower.includes('status')) {
                const overdueCount = tenants.filter((t)=>getTenantBalance(t.id).status === 'OVERDUE' || getTenantBalance(t.id).status === 'PARTIAL').length;
                const pendingMaint = maintenanceTickets.filter((m)=>m.status === 'AWAITING_APPROVAL').length;
                responseText = `Portfolio Health Summary:\n• ${portfolioMetrics.occupancyRate}% Occupancy across ${portfolioMetrics.totalUnits} units\n• KES ${portfolioMetrics.collectedRent.toLocaleString()} collected of KES ${portfolioMetrics.expectedRent.toLocaleString()} expected (${Math.round(portfolioMetrics.collectedRent / (portfolioMetrics.expectedRent || 1) * 100)}%)\n• ${overdueCount} tenants with pending balances\n• ${pendingMaint} high-priority maintenance ticket awaiting your approval (Water Booster Pump KES 28,500)`;
                suggestedAction = {
                    label: 'Open Overview Dashboard',
                    screen: 'overview'
                };
            } else if (lower.includes('reminder') || lower.includes('overdue') || lower.includes('rent')) {
                responseText = `I have drafted personalized WhatsApp reminders for 3 tenants with balances past the 5-day grace period. In accordance with safety policies, batch WhatsApp messages require your explicit review before dispatch.`;
                suggestedAction = {
                    label: 'Approve WhatsApp Reminders',
                    screen: 'agent'
                };
            } else if (lower.includes('maintenance') || lower.includes('repair') || lower.includes('pump')) {
                const pendingMaint = maintenanceTickets.filter((m)=>m.status === 'AWAITING_APPROVAL');
                responseText = `There is 1 high-cost maintenance request requiring your authorization: "Water pump booster pressure failure" at Kilimani Heights (Estimate: KES 28,500). Certified contractor Pwani Hydraulics is on standby.`;
                suggestedAction = {
                    label: 'Review Maintenance Ticket',
                    screen: 'maintenance'
                };
            } else if (lower.includes('lease') || lower.includes('expire') || lower.includes('renewal')) {
                responseText = `Grace Njeri (Unit B3) has a lease expiring in 14 days (Oct 31, 2026), and Brian Otieno (Unit A2) expires in 29 days (Nov 15, 2026). Both qualify for standard 12-month extensions.`;
                suggestedAction = {
                    label: 'View Tenant Directory',
                    screen: 'tenants'
                };
            } else {
                responseText = `Understood. I can help you reconcile M-Pesa payments, audit overdue rent, draft tenant WhatsApp communications, approve fundi quotes, or export KRA tax-ready reports. Select one of the quick actions below:`;
                suggestedAction = {
                    label: 'View All Pending Tasks',
                    screen: 'agent'
                };
            }
            const agentMsg = {
                id: 'msg-agent-' + Date.now(),
                sender: 'AGENT',
                text: responseText,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                suggestedAction
            };
            setAssistantMessages((prev)=>[
                    ...prev,
                    agentMsg
                ]);
        }, 400);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PropertyContext.Provider, {
        value: {
            properties,
            units,
            tenants,
            transactions,
            maintenanceTickets,
            expenses,
            agentTasks,
            automationRules,
            auditLogs,
            whatsappMessages,
            workspaceConfig,
            currentScreen,
            setCurrentScreen,
            selectedPropertyId,
            setSelectedPropertyId,
            searchQuery,
            setSearchQuery,
            theme,
            setTheme,
            currentUser,
            isAuthLoaded,
            switchRole,
            signIn,
            signUp,
            signOut,
            resetDemoData,
            onboardingData,
            updateOnboardingData,
            completeOnboarding,
            isAssistantOpen,
            setIsAssistantOpen,
            assistantMessages,
            sendAssistantMessage,
            toasts,
            dismissToast,
            addToast,
            addProperty,
            updateProperty,
            archiveProperty,
            addUnit,
            updateUnit,
            addTenant,
            updateTenant,
            recordPayment,
            reconcilePayment,
            createMaintenanceTicket,
            updateMaintenanceStatus,
            approveMaintenanceTicket,
            addExpense,
            approveAgentTask,
            rejectAgentTask,
            executeAgentTaskDirectly,
            toggleAutomationRule,
            sendWhatsAppMessage,
            updateWorkspaceConfig,
            getTenantBalance,
            portfolioMetrics
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/PropertyContext.tsx",
        lineNumber: 1104,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PropertyProvider, "3HfGSxm5HlvUI0CHJLZvG+AStds=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = PropertyProvider;
const useProperty = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PropertyContext);
    if (!context) {
        throw new Error('useProperty must be used within a PropertyProvider');
    }
    return context;
};
_s1(useProperty, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "PropertyProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/seedData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initialAgentTasks",
    ()=>initialAgentTasks,
    "initialAuditLogs",
    ()=>initialAuditLogs,
    "initialAutomationRules",
    ()=>initialAutomationRules,
    "initialExpenses",
    ()=>initialExpenses,
    "initialMaintenanceTickets",
    ()=>initialMaintenanceTickets,
    "initialProperties",
    ()=>initialProperties,
    "initialTenants",
    ()=>initialTenants,
    "initialTransactions",
    ()=>initialTransactions,
    "initialUnits",
    ()=>initialUnits,
    "initialWhatsAppMessages",
    ()=>initialWhatsAppMessages,
    "initialWorkspaceConfig",
    ()=>initialWorkspaceConfig
]);
const initialWorkspaceConfig = {
    landlordName: 'David Mwangi',
    workspaceName: 'Mwangi Property Holdings',
    currency: 'KES',
    country: 'Kenya',
    dateFormat: 'DD/MM/YYYY',
    rentDueDay: 5,
    gracePeriodDays: 5,
    lateFeePercentage: 5,
    maintenanceApprovalThreshold: 10000,
    onboardingCompleted: true,
    onboardingStatus: 'completed',
    onboardingStep: 7,
    mpesaPaybillNumber: '522522',
    mpesaAccountRefFormat: 'UnitNumber (e.g. A3)'
};
const initialProperties = [
    {
        id: 'prop-1',
        name: 'Kilimani Heights Apartments',
        location: 'Lenana Road, Kilimani',
        city: 'Nairobi',
        type: 'APARTMENT',
        totalUnits: 12,
        description: 'Executive 2BR & 3BR apartment complex with backup generator, borehole, and electric fencing.',
        caretakerName: 'Patrick Ochieng',
        caretakerPhone: '+254 722 341 890'
    },
    {
        id: 'prop-2',
        name: 'Sapphire Court Westlands',
        location: 'Rhapta Road, Westlands',
        city: 'Nairobi',
        type: 'APARTMENT',
        totalUnits: 8,
        description: 'Boutique residential block near Sarit Centre. High security, fiber internet ready.',
        caretakerName: 'James Kariuki',
        caretakerPhone: '+254 733 912 456'
    },
    {
        id: 'prop-3',
        name: 'Ruaka Greenview Court',
        location: 'Limuru Road, Ruaka',
        city: 'Kiambu / Nairobi Metro',
        type: 'APARTMENT',
        totalUnits: 6,
        description: 'Spacious modern family units 5 mins from Two Rivers Mall.',
        caretakerName: 'Daniel Muthomi',
        caretakerPhone: '+254 711 567 890'
    }
];
const initialUnits = [
    // Kilimani Heights (prop-1)
    {
        id: 'u-101',
        propertyId: 'prop-1',
        unitNumber: 'A1',
        bedrooms: 2,
        typeLabel: '2BR Master Ensuite',
        monthlyRent: 45000,
        serviceCharge: 3500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-1'
    },
    {
        id: 'u-102',
        propertyId: 'prop-1',
        unitNumber: 'A2',
        bedrooms: 2,
        typeLabel: '2BR Master Ensuite',
        monthlyRent: 45000,
        serviceCharge: 3500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-2'
    },
    {
        id: 'u-103',
        propertyId: 'prop-1',
        unitNumber: 'A3',
        bedrooms: 3,
        typeLabel: '3BR All Ensuite + DSQ',
        monthlyRent: 65000,
        serviceCharge: 4500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-3'
    },
    {
        id: 'u-104',
        propertyId: 'prop-1',
        unitNumber: 'A4',
        bedrooms: 2,
        typeLabel: '2BR Master Ensuite',
        monthlyRent: 45000,
        serviceCharge: 3500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-4'
    },
    {
        id: 'u-105',
        propertyId: 'prop-1',
        unitNumber: 'B1',
        bedrooms: 2,
        typeLabel: '2BR Master Ensuite',
        monthlyRent: 45000,
        serviceCharge: 3500,
        status: 'VACANT',
        notes: 'Freshly repainted; viewing available.'
    },
    {
        id: 'u-106',
        propertyId: 'prop-1',
        unitNumber: 'B2',
        bedrooms: 2,
        typeLabel: '2BR Master Ensuite',
        monthlyRent: 45000,
        serviceCharge: 3500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-5'
    },
    {
        id: 'u-107',
        propertyId: 'prop-1',
        unitNumber: 'B3',
        bedrooms: 3,
        typeLabel: '3BR All Ensuite + DSQ',
        monthlyRent: 65000,
        serviceCharge: 4500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-6'
    },
    {
        id: 'u-108',
        propertyId: 'prop-1',
        unitNumber: 'B4',
        bedrooms: 2,
        typeLabel: '2BR Master Ensuite',
        monthlyRent: 45000,
        serviceCharge: 3500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-7'
    },
    // Sapphire Court (prop-2)
    {
        id: 'u-201',
        propertyId: 'prop-2',
        unitNumber: 'Unit 1A',
        bedrooms: 1,
        typeLabel: '1BR Executive',
        monthlyRent: 38000,
        serviceCharge: 3000,
        status: 'OCCUPIED',
        currentTenantId: 'ten-8'
    },
    {
        id: 'u-202',
        propertyId: 'prop-2',
        unitNumber: 'Unit 1B',
        bedrooms: 2,
        typeLabel: '2BR Balcony Suite',
        monthlyRent: 55000,
        serviceCharge: 4000,
        status: 'OCCUPIED',
        currentTenantId: 'ten-9'
    },
    {
        id: 'u-203',
        propertyId: 'prop-2',
        unitNumber: 'Unit 2A',
        bedrooms: 1,
        typeLabel: '1BR Executive',
        monthlyRent: 38000,
        serviceCharge: 3000,
        status: 'VACANT'
    },
    {
        id: 'u-204',
        propertyId: 'prop-2',
        unitNumber: 'Unit 2B',
        bedrooms: 2,
        typeLabel: '2BR Balcony Suite',
        monthlyRent: 55000,
        serviceCharge: 4000,
        status: 'OCCUPIED',
        currentTenantId: 'ten-10'
    },
    // Ruaka Greenview (prop-3)
    {
        id: 'u-301',
        propertyId: 'prop-3',
        unitNumber: 'Villa G1',
        bedrooms: 2,
        typeLabel: '2BR Standard',
        monthlyRent: 32000,
        serviceCharge: 2500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-11'
    },
    {
        id: 'u-302',
        propertyId: 'prop-3',
        unitNumber: 'Villa G2',
        bedrooms: 2,
        typeLabel: '2BR Standard',
        monthlyRent: 32000,
        serviceCharge: 2500,
        status: 'OCCUPIED',
        currentTenantId: 'ten-12'
    },
    {
        id: 'u-303',
        propertyId: 'prop-3',
        unitNumber: 'Villa G3',
        bedrooms: 3,
        typeLabel: '3BR Penthouse',
        monthlyRent: 42000,
        serviceCharge: 3000,
        status: 'MAINTENANCE',
        notes: 'Water heater replacement underway.'
    }
];
const initialTenants = [
    {
        id: 'ten-1',
        name: 'Wanjiku Kamau',
        email: 'wanjiku.kamau@gmail.com',
        phone: '+254 712 345 678',
        nationalIdOrPassport: '28471920',
        assignedPropertyId: 'prop-1',
        assignedUnitId: 'u-101',
        leaseStart: '2025-01-01',
        leaseEnd: '2026-12-31',
        leaseStatus: 'ACTIVE',
        depositAmount: 48500,
        emergencyContactName: 'Peter Kamau (Brother)',
        emergencyContactPhone: '+254 722 100 200'
    },
    {
        id: 'ten-2',
        name: 'Brian Otieno',
        email: 'brian.otieno@outlook.com',
        phone: '+254 722 987 654',
        nationalIdOrPassport: '31902844',
        assignedPropertyId: 'prop-1',
        assignedUnitId: 'u-102',
        leaseStart: '2025-06-01',
        leaseEnd: '2026-11-15',
        leaseStatus: 'EXPIRING_SOON',
        depositAmount: 48500
    },
    {
        id: 'ten-3',
        name: 'Dr. Amina Hassan',
        email: 'amina.hassan@hospital.co.ke',
        phone: '+254 733 445 566',
        nationalIdOrPassport: '24119830',
        assignedPropertyId: 'prop-1',
        assignedUnitId: 'u-103',
        leaseStart: '2024-03-01',
        leaseEnd: '2027-02-28',
        leaseStatus: 'ACTIVE',
        depositAmount: 69500
    },
    {
        id: 'ten-4',
        name: 'Kevin Mwangi',
        email: 'kevin.mwangi@tech.co.ke',
        phone: '+254 701 234 567',
        nationalIdOrPassport: '33491028',
        assignedPropertyId: 'prop-1',
        assignedUnitId: 'u-104',
        leaseStart: '2025-09-01',
        leaseEnd: '2026-08-31',
        leaseStatus: 'ACTIVE',
        depositAmount: 48500
    },
    {
        id: 'ten-5',
        name: 'Fatuma Mohammed',
        email: 'fatuma.m@yahoo.com',
        phone: '+254 722 114 433',
        nationalIdOrPassport: '29881720',
        assignedPropertyId: 'prop-1',
        assignedUnitId: 'u-106',
        leaseStart: '2025-04-01',
        leaseEnd: '2026-12-31',
        leaseStatus: 'ACTIVE',
        depositAmount: 48500
    },
    {
        id: 'ten-6',
        name: 'Grace Njeri',
        email: 'grace.njeri@safari.com',
        phone: '+254 710 889 900',
        nationalIdOrPassport: '27651099',
        assignedPropertyId: 'prop-1',
        assignedUnitId: 'u-107',
        leaseStart: '2024-11-01',
        leaseEnd: '2026-10-31',
        leaseStatus: 'EXPIRING_SOON',
        depositAmount: 69500
    },
    {
        id: 'ten-7',
        name: 'David Kiprono',
        email: 'david.kiprono@logistics.co.ke',
        phone: '+254 721 776 655',
        nationalIdOrPassport: '32109844',
        assignedPropertyId: 'prop-1',
        assignedUnitId: 'u-108',
        leaseStart: '2025-05-01',
        leaseEnd: '2027-04-30',
        leaseStatus: 'ACTIVE',
        depositAmount: 48500
    },
    {
        id: 'ten-8',
        name: 'Sarah Wangari',
        email: 'sarah.w@consulting.co.ke',
        phone: '+254 728 112 233',
        nationalIdOrPassport: '30291884',
        assignedPropertyId: 'prop-2',
        assignedUnitId: 'u-201',
        leaseStart: '2025-02-01',
        leaseEnd: '2026-12-31',
        leaseStatus: 'ACTIVE',
        depositAmount: 41000
    },
    {
        id: 'ten-9',
        name: 'Dennis Mutua',
        email: 'dennis.m@finance.co.ke',
        phone: '+254 719 334 455',
        nationalIdOrPassport: '26554311',
        assignedPropertyId: 'prop-2',
        assignedUnitId: 'u-202',
        leaseStart: '2025-01-15',
        leaseEnd: '2027-01-14',
        leaseStatus: 'ACTIVE',
        depositAmount: 59000
    },
    {
        id: 'ten-10',
        name: 'Linda Cherono',
        email: 'linda.cherono@lawfirm.co.ke',
        phone: '+254 724 667 788',
        nationalIdOrPassport: '31092833',
        assignedPropertyId: 'prop-2',
        assignedUnitId: 'u-204',
        leaseStart: '2025-03-01',
        leaseEnd: '2026-12-31',
        leaseStatus: 'ACTIVE',
        depositAmount: 59000
    },
    {
        id: 'ten-11',
        name: 'John Ngugi',
        email: 'john.ngugi@agribusiness.co.ke',
        phone: '+254 718 552 299',
        nationalIdOrPassport: '28994510',
        assignedPropertyId: 'prop-3',
        assignedUnitId: 'u-301',
        leaseStart: '2025-07-01',
        leaseEnd: '2026-12-31',
        leaseStatus: 'ACTIVE',
        depositAmount: 34500
    },
    {
        id: 'ten-12',
        name: 'Mercy Akinyi',
        email: 'mercy.akinyi@edu.ke',
        phone: '+254 735 112 334',
        nationalIdOrPassport: '33109822',
        assignedPropertyId: 'prop-3',
        assignedUnitId: 'u-302',
        leaseStart: '2025-08-01',
        leaseEnd: '2026-12-31',
        leaseStatus: 'ACTIVE',
        depositAmount: 34500
    }
];
const initialTransactions = [
    // Confirmed Payments for this month (October 2026)
    {
        id: 'tx-1',
        date: '2026-10-04T08:14:20Z',
        amount: 48500,
        channel: 'M-PESA',
        referenceNumber: 'QHK904128X',
        status: 'CONFIRMED',
        tenantId: 'ten-1',
        propertyId: 'prop-1',
        unitId: 'u-101',
        senderPhone: '254712345678',
        senderName: 'WANJIKU KAMAU',
        billRefNumber: 'A1',
        notes: 'Rent + Service Charge October 2026',
        receiptNumber: 'KEJA-REC-2026-001'
    },
    {
        id: 'tx-2',
        date: '2026-10-05T10:45:12Z',
        amount: 69500,
        channel: 'M-PESA',
        referenceNumber: 'QHR847291B',
        status: 'CONFIRMED',
        tenantId: 'ten-3',
        propertyId: 'prop-1',
        unitId: 'u-103',
        senderPhone: '254733445566',
        senderName: 'AMINA HASSAN',
        billRefNumber: 'A3',
        notes: 'October Rent & Service Charge',
        receiptNumber: 'KEJA-REC-2026-002'
    },
    {
        id: 'tx-3',
        date: '2026-10-03T14:22:05Z',
        amount: 41000,
        channel: 'M-PESA',
        referenceNumber: 'QHJ382910M',
        status: 'CONFIRMED',
        tenantId: 'ten-8',
        propertyId: 'prop-2',
        unitId: 'u-201',
        senderPhone: '254728112233',
        senderName: 'SARAH WANGARI',
        billRefNumber: '1A',
        receiptNumber: 'KEJA-REC-2026-003'
    },
    {
        id: 'tx-4',
        date: '2026-10-05T17:05:40Z',
        amount: 59000,
        channel: 'BANK_TRANSFER',
        referenceNumber: 'NCBA-TR-99410',
        status: 'CONFIRMED',
        tenantId: 'ten-9',
        propertyId: 'prop-2',
        unitId: 'u-202',
        notes: 'NCBA direct transfer Unit 1B',
        receiptNumber: 'KEJA-REC-2026-004'
    },
    {
        id: 'tx-5',
        date: '2026-10-02T11:15:00Z',
        amount: 34500,
        channel: 'M-PESA',
        referenceNumber: 'QHK102938Z',
        status: 'CONFIRMED',
        tenantId: 'ten-12',
        propertyId: 'prop-3',
        unitId: 'u-302',
        senderPhone: '254735112334',
        senderName: 'MERCY AKINYI',
        billRefNumber: 'G2',
        receiptNumber: 'KEJA-REC-2026-005'
    },
    // 2 UNALLOCATED transactions for real interactive demonstration of the AI reconciliation workflow!
    {
        id: 'tx-unalloc-1',
        date: '2026-10-15T09:12:00Z',
        amount: 48500,
        channel: 'M-PESA',
        referenceNumber: 'QHT992810P',
        status: 'UNALLOCATED',
        senderPhone: '254722114433',
        senderName: 'FATUMA MOHAMMED',
        billRefNumber: 'B2',
        notes: 'Paybill 522522 deposit received without automatic lease match'
    },
    {
        id: 'tx-unalloc-2',
        date: '2026-10-16T15:30:45Z',
        amount: 34500,
        channel: 'M-PESA',
        referenceNumber: 'QHU104928K',
        status: 'UNALLOCATED',
        senderPhone: '254718552299',
        senderName: 'JOHN NGUGI',
        billRefNumber: 'VILLA G1',
        notes: 'M-Pesa payment ref Villa G1'
    }
];
const initialMaintenanceTickets = [
    {
        id: 'maint-1',
        title: 'Water pump booster pressure failure',
        description: 'Main rooftop booster pump tripping circuit breaker. Roof tank not filling properly during low city water pressure hours.',
        propertyId: 'prop-1',
        priority: 'HIGH',
        status: 'AWAITING_APPROVAL',
        reportedDate: '2026-10-16T08:00:00Z',
        estimatedCost: 28500,
        assigneeName: 'Pwani Hydraulics & Electricals',
        assigneeRole: 'Certified Contractor',
        assigneePhone: '+254 722 556 677',
        whatsappSimulatedMessage: 'Hujambo Landlord, Patrick caretaker hapa. Booster pump ya rooftop inashuka breaker kila mara. Fundi amepima akasema motor rewind na capacitor mpya ni 28,500/= quote.'
    },
    {
        id: 'maint-2',
        title: 'Leaking shower valve in Master Ensuite',
        description: 'Shower mixer leaking continuously into the drain, causing high water meter sub-reading.',
        propertyId: 'prop-1',
        unitId: 'u-104',
        tenantId: 'ten-4',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        reportedDate: '2026-10-14T11:20:00Z',
        estimatedCost: 4500,
        assigneeName: 'Fundi Joseph (Plumber)',
        assigneeRole: 'Kilimani Estates Plumber',
        assigneePhone: '+254 710 445 566',
        approvedBy: 'Property Manager',
        approvedAt: '2026-10-14T13:00:00Z',
        whatsappSimulatedMessage: 'Hi David, the shower mixer in my master bathroom has been dripping heavily since yesterday. Could someone look at it?'
    },
    {
        id: 'maint-3',
        title: 'Main entry biometric gate lock glitch',
        description: 'Keypad not accepting tenant fobs after power surge.',
        propertyId: 'prop-2',
        priority: 'MEDIUM',
        status: 'NEW',
        reportedDate: '2026-10-17T09:00:00Z',
        estimatedCost: 6500,
        whatsappSimulatedMessage: 'Good morning, the electronic gate scanner is showing red lights for unit fobs since this morning.'
    },
    {
        id: 'maint-4',
        title: 'Kitchen drainage pipe unclogging',
        description: 'Clear fat buildup in external gully trap.',
        propertyId: 'prop-3',
        unitId: 'u-301',
        tenantId: 'ten-11',
        priority: 'LOW',
        status: 'RESOLVED',
        reportedDate: '2026-10-08T10:00:00Z',
        estimatedCost: 3000,
        assigneeName: 'Fundi Peter',
        resolutionNotes: 'Traps cleared with caustic soda and high pressure jetting. Flow fully restored.',
        approvedBy: 'David Mwangi (Landlord)',
        approvedAt: '2026-10-08T11:00:00Z'
    }
];
const initialExpenses = [
    {
        id: 'exp-1',
        propertyId: 'prop-1',
        category: 'SECURITY_CARETAKER',
        description: 'Caretaker Monthly Wages (Patrick Ochieng)',
        amount: 22000,
        date: '2026-10-01',
        vendor: 'Patrick Ochieng',
        receiptStatus: 'ATTACHED',
        status: 'APPROVED'
    },
    {
        id: 'exp-2',
        propertyId: 'prop-1',
        category: 'GARBAGE_COLLECTION',
        description: 'Waste Management & Recycling Services (October)',
        amount: 6000,
        date: '2026-10-05',
        vendor: 'CleanSweep Nairobi Ltd',
        receiptStatus: 'ATTACHED',
        status: 'APPROVED'
    },
    {
        id: 'exp-3',
        propertyId: 'prop-1',
        category: 'KPLC_ELECTRICITY',
        description: 'Common Area & Lift Prepaid Tokens',
        amount: 14500,
        date: '2026-10-07',
        vendor: 'Kenya Power (KPLC Prepaid)',
        receiptStatus: 'ATTACHED',
        status: 'APPROVED'
    },
    {
        id: 'exp-4',
        propertyId: 'prop-2',
        category: 'SECURITY_CARETAKER',
        description: 'Day & Night Guard Patrol Services',
        amount: 35000,
        date: '2026-10-02',
        vendor: 'SecureGuard Kenya Security',
        receiptStatus: 'ATTACHED',
        status: 'APPROVED'
    },
    {
        id: 'exp-5',
        propertyId: 'prop-3',
        category: 'NAIROBI_WATER',
        description: 'Borehole servicing & water testing kit',
        amount: 8500,
        date: '2026-10-09',
        vendor: 'AquaPure Kenya',
        receiptStatus: 'ATTACHED',
        status: 'APPROVED'
    }
];
const initialAgentTasks = [
    {
        id: 'task-1',
        title: 'Match & Reconcile 2 Unallocated M-Pesa Payments',
        description: 'Identified 2 unallocated M-Pesa receipts (KES 83,000 total) with matching bill references and tenant phone records in Kilimani Heights and Ruaka Greenview.',
        requestedOutcome: 'Update tenant rent ledgers, mark transactions RECONCILED, and generate automated payment receipts.',
        category: 'RECONCILIATION',
        status: 'AWAITING_APPROVAL',
        safetyLevel: 'REQUIRES_APPROVAL',
        requiredRole: 'LANDLORD',
        affectedEntities: {
            transactionIds: [
                'tx-unalloc-1',
                'tx-unalloc-2'
            ],
            tenantIds: [
                'ten-5',
                'ten-11'
            ]
        },
        planSteps: [
            {
                step: 'Scan M-Pesa statement for phone numbers and bill reference patterns',
                status: 'DONE'
            },
            {
                step: 'Match Fatuma Mohammed (Unit B2) to Ref QHT992810P (KES 48,500)',
                status: 'DONE'
            },
            {
                step: 'Match John Ngugi (Villa G1) to Ref QHU104928K (KES 34,500)',
                status: 'DONE'
            },
            {
                step: 'Apply credit to October ledgers and dispatch WhatsApp confirmation receipts',
                status: 'PENDING'
            }
        ],
        proposedChangesSummary: '2 transactions (total KES 83,000) will be reconciled to Unit B2 (Fatuma Mohammed) and Villa G1 (John Ngugi). Both tenant balances will transition to PAID.',
        createdAt: '2026-10-16T16:00:00Z'
    },
    {
        id: 'task-2',
        title: 'Draft Overdue Rent Reminders for 3 Tenants',
        description: 'October rent grace period ended on Oct 10. 3 tenants currently hold unpaid balances (Brian Otieno KES 48,500, Kevin Mwangi KES 48,500, and Linda Cherono KES 59,000).',
        requestedOutcome: 'Prepare customized WhatsApp reminder messages with payment details and polite follow-up tone.',
        category: 'RENT_COLLECTION',
        status: 'AWAITING_APPROVAL',
        safetyLevel: 'REQUIRES_APPROVAL',
        requiredRole: 'LANDLORD',
        affectedEntities: {
            tenantIds: [
                'ten-2',
                'ten-4',
                'ten-10'
            ],
            propertyIds: [
                'prop-1',
                'prop-2'
            ]
        },
        planSteps: [
            {
                step: 'Filter tenants with overdue arrears past 5-day grace period',
                status: 'DONE'
            },
            {
                step: 'Generate personalized WhatsApp templates with M-Pesa Paybill 522522 & specific unit account numbers',
                status: 'DONE'
            },
            {
                step: 'Queue for Landlord signoff prior to WhatsApp dispatch (Batch protection enforced)',
                status: 'PENDING'
            }
        ],
        proposedChangesSummary: 'Send 3 WhatsApp rent payment reminder messages. No charges or penalties modified.',
        createdAt: '2026-10-15T10:00:00Z'
    },
    {
        id: 'task-3',
        title: 'Q4 Lease Expiration & Renewal Review',
        description: 'Audited leases ending within the next 45 days. Grace Njeri (Unit B3) expires Oct 31, 2026. Brian Otieno (Unit A2) expires Nov 15, 2026.',
        requestedOutcome: 'Draft renewal offer summaries and notify landlord to establish new term preferences.',
        category: 'LEASE_AUDIT',
        status: 'PROPOSED',
        safetyLevel: 'AUTONOMOUS',
        requiredRole: 'PROPERTY_MANAGER',
        affectedEntities: {
            tenantIds: [
                'ten-6',
                'ten-2'
            ],
            unitIds: [
                'u-107',
                'u-102'
            ]
        },
        planSteps: [
            {
                step: 'Query tenancy registry for expiry dates <= 45 days',
                status: 'DONE'
            },
            {
                step: 'Assess payment reliability score (Grace: 100% on-time, Brian: 2 late payments)',
                status: 'DONE'
            },
            {
                step: 'Recommend standard 12-month extension with 5% rent adjustment for Kilimani market index',
                status: 'PENDING'
            }
        ],
        proposedChangesSummary: 'Prepares renewal offer drafts for Landlord review. Leases will not be amended automatically.',
        createdAt: '2026-10-14T12:00:00Z'
    }
];
const initialAutomationRules = [
    {
        id: 'rule-1',
        name: 'Automatic M-Pesa Reference Reconciliation',
        description: 'When an M-Pesa payment matches both tenant phone number and unit bill reference with >80% confidence, draft reconciliation task.',
        triggerEvent: 'Incoming M-Pesa Webhook',
        actionSummary: 'Draft reconciliation & notify Landlord',
        enabled: true,
        requiresLandlordApproval: true
    },
    {
        id: 'rule-2',
        name: 'Grace Period Overdue Arrears Flagging',
        description: 'On day 11 of the calendar month (day after 5-day grace period), scan all units and prepare rent reminder batch.',
        triggerEvent: 'Monthly Schedule (11th of month)',
        actionSummary: 'Compile arrears list & generate WhatsApp reminder batch',
        enabled: true,
        requiresLandlordApproval: true
    },
    {
        id: 'rule-3',
        name: 'Emergency Maintenance Immediate Alert',
        description: 'When tenant submits ticket classified as EMERGENCY (e.g. electrical fire hazard, burst main pipe), immediately notify Landlord via SMS and WhatsApp.',
        triggerEvent: 'Ticket Priority = EMERGENCY',
        actionSummary: 'Send urgent SMS alert to Landlord phone',
        enabled: true,
        requiresLandlordApproval: false
    },
    {
        id: 'rule-4',
        name: 'High-Cost Maintenance Expenditure Guard',
        description: 'Any repair or maintenance work order exceeding KES 10,000 cannot be assigned or authorized without Landlord signature.',
        triggerEvent: 'Maintenance Cost > KES 10,000',
        actionSummary: 'Enforce Landlord signature requirement',
        enabled: true,
        requiresLandlordApproval: true
    }
];
const initialAuditLogs = [
    {
        id: 'log-1',
        timestamp: '2026-10-16T16:02:11Z',
        actor: 'AI_AGENT',
        action: 'TASK_CREATED',
        details: 'Compiled reconciliation task for 2 unallocated transactions totaling KES 83,000.',
        taskId: 'task-1'
    },
    {
        id: 'log-2',
        timestamp: '2026-10-15T10:05:40Z',
        actor: 'AI_AGENT',
        action: 'REMINDER_DRAFTED',
        details: 'Generated 3 polite WhatsApp rent reminders for tenants with overdue balances.',
        taskId: 'task-2'
    },
    {
        id: 'log-3',
        timestamp: '2026-10-14T13:00:00Z',
        actor: 'PROPERTY_MANAGER',
        action: 'MAINTENANCE_APPROVED',
        details: 'Approved plumbing repair ticket maint-2 (KES 4,500) for Unit A4.'
    },
    {
        id: 'log-4',
        timestamp: '2026-10-14T12:05:00Z',
        actor: 'AI_AGENT',
        action: 'LEASE_AUDIT',
        details: 'Detected 2 leases expiring in Q4; drafted renewal evaluation report.',
        taskId: 'task-3'
    }
];
const initialWhatsAppMessages = [
    {
        id: 'msg-1',
        tenantId: 'ten-1',
        sender: 'AI_AGENT',
        message: 'Hello Wanjiku, receipt confirmed for KES 48,500 (Ref: QHK904128X) for Unit A1 Kilimani Heights. Your balance is 0.00 KES. Thank you!',
        timestamp: '2026-10-04T08:15:00Z',
        status: 'DELIVERED',
        isSimulated: true
    },
    {
        id: 'msg-2',
        tenantId: 'ten-2',
        sender: 'TENANT',
        message: 'Habari David, I am traveling back to Nairobi tomorrow from Kisumu and will clear the October rent on Friday via M-Pesa. Asante.',
        timestamp: '2026-10-09T14:30:00Z',
        status: 'READ',
        isSimulated: true
    },
    {
        id: 'msg-3',
        tenantId: 'ten-4',
        sender: 'TENANT',
        message: 'Hi David, the shower mixer in my master bathroom has been dripping heavily since yesterday. Could someone look at it?',
        timestamp: '2026-10-14T11:18:00Z',
        status: 'READ',
        isSimulated: true
    },
    {
        id: 'msg-4',
        tenantId: 'ten-4',
        sender: 'AI_AGENT',
        message: 'Jambo Kevin, your maintenance request #maint-2 has been received and assigned to Fundi Joseph (Plumber). He will arrive between 2:00 PM and 4:00 PM today.',
        timestamp: '2026-10-14T13:02:00Z',
        status: 'DELIVERED',
        isSimulated: true
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/propertyMath.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pure domain logic for Kejahub Property AI Agent
 * Decoupled from UI for testing and portability.
 */ __turbopack_context__.s([
    "calculateTenantBalance",
    ()=>calculateTenantBalance,
    "evaluateAgentActionSafety",
    ()=>evaluateAgentActionSafety,
    "formatKES",
    ()=>formatKES,
    "matchMpesaTransaction",
    ()=>matchMpesaTransaction,
    "normalizePhoneNumber",
    ()=>normalizePhoneNumber
]);
function calculateTenantBalance(charges, payments, dueDateDay = 5, referenceDate = new Date()) {
    const totalCharges = charges.reduce((acc, c)=>acc + (c.amount || 0), 0);
    const totalPayments = payments.filter((p)=>p.status === 'CONFIRMED' || p.status === 'RECONCILED').reduce((acc, p)=>acc + (p.amount || 0), 0);
    const balance = totalCharges - totalPayments;
    const currentDay = referenceDate.getDate();
    let daysOverdue = 0;
    if (balance > 0 && currentDay > dueDateDay) {
        daysOverdue = currentDay - dueDateDay;
    }
    let status = 'PAID';
    if (balance > 0) {
        status = totalPayments > 0 ? 'PARTIAL' : 'OVERDUE';
    } else if (balance < 0) {
        status = 'CREDIT';
    }
    return {
        totalCharges,
        totalPayments,
        balance,
        status,
        daysOverdue
    };
}
function normalizePhoneNumber(phone) {
    // Normalize Kenyan phone numbers e.g. 0712345678 -> 254712345678, +254 712 345 678 -> 254712345678
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
        return '254' + digits.substring(1);
    }
    if (digits.startsWith('254') && digits.length === 12) {
        return digits;
    }
    return digits;
}
function matchMpesaTransaction(tx, candidates) {
    if (!candidates || candidates.length === 0) {
        return {
            candidate: null,
            confidence: 'NONE',
            matchReason: 'No candidates available',
            score: 0
        };
    }
    const normalizedTxPhone = normalizePhoneNumber(tx.senderPhone || '');
    const cleanRef = (tx.billRefNumber || '').trim().toUpperCase();
    let bestCandidate = null;
    let highestScore = 0;
    let reason = '';
    for (const cand of candidates){
        let score = 0;
        const candPhone = normalizePhoneNumber(cand.phone);
        const candUnit = cand.unitNumber.trim().toUpperCase();
        // 1. Account / Bill Reference match (e.g. Tenant typed "A4" or "UNIT A4")
        if (cleanRef && (cleanRef === candUnit || cleanRef.includes(candUnit))) {
            score += 50;
        }
        // 2. Exact or partial phone number match
        if (normalizedTxPhone && candPhone && (normalizedTxPhone === candPhone || normalizedTxPhone.endsWith(candPhone.slice(-9)))) {
            score += 40;
        }
        // 3. Exact expected rent amount match
        if (tx.amount > 0 && cand.monthlyExpected > 0 && Math.abs(tx.amount - cand.monthlyExpected) < 1) {
            score += 20;
        }
        // 4. Name similarity (first or last name matches)
        if (tx.senderName && cand.tenantName) {
            const txParts = tx.senderName.toUpperCase().split(/\s+/);
            const candParts = cand.tenantName.toUpperCase().split(/\s+/);
            const sharesName = txParts.some((p)=>p.length > 2 && candParts.includes(p));
            if (sharesName) {
                score += 15;
            }
        }
        if (score > highestScore) {
            highestScore = score;
            bestCandidate = cand;
            const reasons = [];
            if (cleanRef && (cleanRef === candUnit || cleanRef.includes(candUnit))) reasons.push(`Unit ref '${cleanRef}' matched`);
            if (normalizedTxPhone && candPhone && normalizedTxPhone.endsWith(candPhone.slice(-9))) reasons.push('Sender phone matched tenant');
            if (Math.abs(tx.amount - cand.monthlyExpected) < 1) reasons.push('Amount equals monthly expected rent');
            reason = reasons.join(', ');
        }
    }
    let confidence = 'NONE';
    if (highestScore >= 60) {
        confidence = 'HIGH';
    } else if (highestScore >= 40) {
        confidence = 'MEDIUM';
    } else if (highestScore >= 20) {
        confidence = 'LOW';
    }
    return {
        candidate: highestScore >= 20 ? bestCandidate : null,
        confidence,
        matchReason: reason || 'Low correlation with known tenant units or numbers',
        score: highestScore
    };
}
function evaluateAgentActionSafety(actionType, userRole, costOrCount = 0, maintenanceCostThreshold = 10000) {
    // Read-only cannot perform any mutating or communicating actions
    if (userRole === 'READ_ONLY') {
        if (actionType === 'DRAFT_SUMMARY' || actionType === 'CLASSIFY_EXPENSE') {
            return {
                allowed: true,
                requiresLandlordApproval: false,
                policyReason: 'Informational analysis is permitted'
            };
        }
        return {
            allowed: false,
            requiresLandlordApproval: true,
            policyReason: 'Read-only role cannot execute operations'
        };
    }
    // Maintenance staff only deals with maintenance triage and draft
    if (userRole === 'MAINTENANCE') {
        if (actionType === 'APPROVE_MAINTENANCE') {
            if (costOrCount > maintenanceCostThreshold) {
                return {
                    allowed: false,
                    requiresLandlordApproval: true,
                    policyReason: `Estimates exceeding KES ${maintenanceCostThreshold.toLocaleString()} require Landlord approval`
                };
            }
            return {
                allowed: true,
                requiresLandlordApproval: false,
                policyReason: 'Within minor maintenance threshold'
            };
        }
        if (actionType === 'DRAFT_SUMMARY') {
            return {
                allowed: true,
                requiresLandlordApproval: false,
                policyReason: 'Summary preview allowed'
            };
        }
        return {
            allowed: false,
            requiresLandlordApproval: true,
            policyReason: 'Maintenance role restricted to repair tickets'
        };
    }
    // Financial actions
    if (actionType === 'WAIVE_RENT' || actionType === 'AMEND_LEASE') {
        // Only Landlord can waive rent or amend lease terms
        if (userRole === 'LANDLORD') {
            return {
                allowed: true,
                requiresLandlordApproval: true,
                policyReason: 'High-impact legal/financial action requires explicit landlord sign-off'
            };
        }
        return {
            allowed: false,
            requiresLandlordApproval: true,
            policyReason: 'Only Landlord can authorize rent waivers or lease modifications'
        };
    }
    // Batch communication
    if (actionType === 'SEND_BATCH_WHATSAPP') {
        return {
            allowed: true,
            requiresLandlordApproval: true,
            policyReason: `Batch messaging (${costOrCount} recipients) requires human approval before broadcast`
        };
    }
    // Maintenance approval above threshold
    if (actionType === 'APPROVE_MAINTENANCE') {
        if (costOrCount > maintenanceCostThreshold && userRole !== 'LANDLORD') {
            return {
                allowed: false,
                requiresLandlordApproval: true,
                policyReason: `High-value maintenance (KES ${costOrCount.toLocaleString()}) requires Landlord sign-off`
            };
        }
        return {
            allowed: true,
            requiresLandlordApproval: false,
            policyReason: 'Approved within budget limit'
        };
    }
    return {
        allowed: true,
        requiresLandlordApproval: false,
        policyReason: 'Autonomous execution authorized under safety policy'
    };
}
function formatKES(amount) {
    const rounded = Math.round(amount || 0);
    return `KES ${rounded.toLocaleString('en-KE')}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]})(),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_042hfpqvpd56k._.js.map