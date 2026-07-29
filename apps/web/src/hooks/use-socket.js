"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSocketEvent = useSocketEvent;
const react_1 = require("react");
const socket_provider_1 = require("../components/providers/socket-provider");
function useSocketEvent(event, callback) {
    const { socket, isConnected } = (0, socket_provider_1.useSocketContext)();
    (0, react_1.useEffect)(() => {
        if (!socket || !isConnected)
            return;
        socket.on(event, callback);
        return () => {
            socket.off(event, callback);
        };
    }, [socket, isConnected, event, callback]);
}
