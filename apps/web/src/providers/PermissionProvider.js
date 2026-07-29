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
exports.PermissionProvider = PermissionProvider;
exports.usePermissions = usePermissions;
const react_1 = __importStar(require("react"));
const PermissionContext = (0, react_1.createContext)(undefined);
function PermissionProvider({ children, initialPermissions = [], }) {
    const [permissions, setPermissions] = (0, react_1.useState)(initialPermissions);
    const hasPermission = (permission) => {
        return permissions.includes(permission) || permissions.includes('admin:access');
    };
    const hasAllPermissions = (perms) => {
        return perms.every((p) => hasPermission(p));
    };
    const hasAnyPermission = (perms) => {
        return perms.some((p) => hasPermission(p));
    };
    return (<PermissionContext.Provider value={{ permissions, setPermissions, hasPermission, hasAllPermissions, hasAnyPermission }}>
      {children}
    </PermissionContext.Provider>);
}
function usePermissions() {
    const context = (0, react_1.useContext)(PermissionContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
}
