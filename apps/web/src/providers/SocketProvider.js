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
exports.SocketProvider = SocketProvider;
exports.useSocket = useSocket;
const react_1 = __importStar(require("react"));
const socket_io_client_1 = require("socket.io-client");
const lucide_react_1 = require("lucide-react");
const SocketContext = (0, react_1.createContext)(undefined);
function SocketProvider({ children }) {
    const [socket, setSocket] = (0, react_1.useState)(null);
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const triggerToast = (title, message) => {
        const id = String(Date.now());
        setToasts((prev) => [...prev, { id, title, message }]);
        setTimeout(() => removeToast(id), 5000);
    };
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };
    (0, react_1.useEffect)(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000/realtime';
        const socketInstance = (0, socket_io_client_1.io)(wsUrl, {
            withCredentials: true,
            autoConnect: false,
        });
        socketInstance.on('connect', () => {
            setIsConnected(true);
        });
        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });
        socketInstance.on('notification:new', (data) => {
            triggerToast(data.title || 'Realtime Alert', data.message || 'New clinic update received');
        });
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, []);
    return (<SocketContext.Provider value={{ socket, isConnected, toasts, removeToast, triggerToast }}>
      {children}

      {/* Floating Realtime Toast Notifications Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full">
        {toasts.map((toast) => (<div key={toast.id} className="flex items-start justify-between gap-3 p-4 rounded-xl border border-primary/20 bg-card/95 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <lucide_react_1.Bell className="w-4 h-4"/>
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-foreground">{toast.title}</div>
                <div className="text-muted-foreground">{toast.message}</div>
              </div>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-muted-foreground hover:text-foreground p-0.5 rounded">
              <lucide_react_1.X className="w-3.5 h-3.5"/>
            </button>
          </div>))}
      </div>
    </SocketContext.Provider>);
}
function useSocket() {
    const context = (0, react_1.useContext)(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
