module.exports = [
(()=>{"use strict";return[
"[project]/src/context/PropertyContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/seedData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$propertyMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/propertyMath.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const PropertyContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
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
    if ("TURBOPACK compile-time truthy", 1) return fallback;
    //TURBOPACK unreachable
    ;
}
const PropertyProvider = ({ children })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    // Theme state
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('light');
    // Current user state - defaults to unauthenticated
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultUnauthenticatedUser);
    const [isAuthLoaded, setIsAuthLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Onboarding draft state
    const [onboardingData, setOnboardingData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultOnboardingData);
    // Screen & Navigation
    const [currentScreen, setCurrentScreenState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('overview');
    const [selectedPropertyId, setSelectedPropertyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Assistant State
    const [isAssistantOpen, setIsAssistantOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [assistantMessages, setAssistantMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 'init-1',
            sender: 'AGENT',
            text: 'Jambo! I am your Kejahub Property Agent. I assist with property monitoring, M-Pesa rent reconciliation, and WhatsApp communications.',
            timestamp: '12:00 PM'
        }
    ]);
    // Toasts
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
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
    const [properties, setProperties] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialProperties"]);
    const [units, setUnits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialUnits"]);
    const [tenants, setTenants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialTenants"]);
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialTransactions"]);
    const [maintenanceTickets, setMaintenanceTickets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialMaintenanceTickets"]);
    const [expenses, setExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialExpenses"]);
    const [agentTasks, setAgentTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialAgentTasks"]);
    const [automationRules, setAutomationRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialAutomationRules"]);
    const [auditLogs, setAuditLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialAuditLogs"]);
    const [whatsappMessages, setWhatsAppMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialWhatsAppMessages"]);
    const [workspaceConfig, setWorkspaceConfigState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialWorkspaceConfig"]);
    // Sync state from client localStorage after mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const savedTheme = undefined;
        const savedUser = undefined;
        const savedDraft = undefined;
    }, []);
    // Sync route pathname with currentScreen
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        pathname
    ]);
    const setCurrentScreen = (screen)=>{
        setCurrentScreenState(screen);
        if (router && typeof router.push === 'function') {
            router.push('/' + screen);
        }
    };
    // Apply Theme effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const root = document.documentElement;
        const isDark = theme === 'dark' || theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('kejahub_theme', theme);
    }, [
        theme
    ]);
    // Persist entities
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_props', JSON.stringify(properties));
    }, [
        properties
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_units', JSON.stringify(units));
    }, [
        units
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_tenants', JSON.stringify(tenants));
    }, [
        tenants
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_txs', JSON.stringify(transactions));
    }, [
        transactions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_maint', JSON.stringify(maintenanceTickets));
    }, [
        maintenanceTickets
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_exp', JSON.stringify(expenses));
    }, [
        expenses
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_tasks', JSON.stringify(agentTasks));
    }, [
        agentTasks
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_rules', JSON.stringify(automationRules));
    }, [
        automationRules
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_logs', JSON.stringify(auditLogs));
    }, [
        auditLogs
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_wa', JSON.stringify(whatsappMessages));
    }, [
        whatsappMessages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY + '_config', JSON.stringify(workspaceConfig));
    }, [
        workspaceConfig
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('kejahub_user', JSON.stringify(currentUser));
    }, [
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
        setProperties(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialProperties"]);
        setUnits(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialUnits"]);
        setTenants(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialTenants"]);
        setTransactions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialTransactions"]);
        setMaintenanceTickets(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialMaintenanceTickets"]);
        setExpenses(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialExpenses"]);
        setAgentTasks(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialAgentTasks"]);
        setAutomationRules(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialAutomationRules"]);
        setAuditLogs(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialAuditLogs"]);
        setWhatsAppMessages(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialWhatsAppMessages"]);
        setWorkspaceConfigState(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seedData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialWorkspaceConfig"]);
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$propertyMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateTenantBalance"])(charges, tenantPayments, workspaceConfig.rentDueDay);
    };
    // Portfolio KPIs derived authoritatively
    const portfolioMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const filteredUnits = selectedPropertyId ? units.filter((u)=>u.propertyId === selectedPropertyId) : units;
        const filteredTenants = selectedPropertyId ? tenants.filter((t)=>t.assignedPropertyId === selectedPropertyId) : tenants;
        const filteredTransactions = selectedPropertyId ? transactions.filter((tx)=>tx.propertyId === selectedPropertyId || !tx.propertyId) : transactions;
        const totalUnits = filteredUnits.length;
        const occupiedUnits = filteredUnits.filter((u)=>u.status === 'OCCUPIED').length;
        const vacantUnits = filteredUnits.filter((u)=>u.status === 'VACANT').length;
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
        const unallocatedTxs = transactions.filter((tx)=>tx.status === 'UNALLOCATED');
        const unallocatedCount = unallocatedTxs.length;
        const unallocatedAmount = unallocatedTxs.reduce((sum, tx)=>sum + tx.amount, 0);
        const outstandingRent = Math.max(0, expectedRent - collectedRent);
        const pendingMaintenanceCount = maintenanceTickets.filter((m)=>(!selectedPropertyId || m.propertyId === selectedPropertyId) && (m.status === 'NEW' || m.status === 'AWAITING_APPROVAL')).length;
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
    }, [
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
        const safety = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$propertyMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["evaluateAgentActionSafety"])('APPROVE_MAINTENANCE', currentUser.role, ticket.estimatedCost, workspaceConfig.maintenanceApprovalThreshold);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PropertyContext.Provider, {
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
const useProperty = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(PropertyContext);
    if (!context) {
        throw new Error('useProperty must be used within a PropertyProvider');
    }
    return context;
};
}),
"[project]/src/data/seedData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/utils/propertyMath.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
]})(),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1keyn-ejygsgq._.js.map