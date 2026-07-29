"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = ThemeProvider;
exports.useTheme = useTheme;
const react_1 = __importStar(require("react"));
const tokens_1 = require("@/lib/theme/tokens");
const ThemeContext = (0, react_1.createContext)(undefined);
function ThemeProvider({ children, initialTheme = tokens_1.defaultThemeTokens, }) {
    const [theme, setTheme] = (0, react_1.useState)(initialTheme);
    const [mode, setModeState] = (0, react_1.useState)('light');
    // Load saved theme on mount
    (0, react_1.useEffect)(() => {
        const savedMode = localStorage.getItem('theme-mode');
        if (savedMode) {
            setModeState(savedMode);
        }
        else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setModeState('dark');
        }
    }, []);
    const setMode = (newMode) => {
        setModeState(newMode);
        localStorage.setItem('theme-mode', newMode);
    };
    // Inject CSS Variables dynamically into DOM root
    (0, react_1.useEffect)(() => {
        const root = document.documentElement;
        if (theme.primary)
            root.style.setProperty('--primary', theme.primary);
        if (theme.accent)
            root.style.setProperty('--accent', theme.accent);
        if (theme.radius)
            root.style.setProperty('--radius', theme.radius);
        if (theme.success)
            root.style.setProperty('--success', theme.success);
        if (theme.warning)
            root.style.setProperty('--warning', theme.warning);
        if (theme.danger)
            root.style.setProperty('--destructive', theme.danger);
        // Apply Chart palette
        theme.chartPalette?.forEach((color, idx) => {
            root.style.setProperty(`--chart-${idx + 1}`, color);
        });
    }, [theme]);
    // Dark/Light mode class handler
    (0, react_1.useEffect)(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (mode === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
            return;
        }
        root.classList.add(mode);
    }, [mode]);
    const updateCustomTheme = (tokens) => {
        setTheme((prev) => ({ ...prev, ...tokens }));
    };
    return (<ThemeContext.Provider value={{ theme, mode, setMode, updateCustomTheme }}>
      {children}
    </ThemeContext.Provider>);
}
function useTheme() {
    const context = (0, react_1.useContext)(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
