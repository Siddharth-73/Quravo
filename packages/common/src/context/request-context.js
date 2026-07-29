"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const async_hooks_1 = require("async_hooks");
const asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
class RequestContext {
    static run(store, callback) {
        return asyncLocalStorage.run(store, callback);
    }
    static getStore() {
        return asyncLocalStorage.getStore();
    }
    static get requestId() {
        return this.getStore()?.requestId;
    }
    static get tenantId() {
        return this.getStore()?.tenantId;
    }
    static get userId() {
        return this.getStore()?.userId;
    }
    static setTenantId(tenantId) {
        const store = this.getStore();
        if (store) {
            store.tenantId = tenantId;
        }
    }
    static setUserId(userId) {
        const store = this.getStore();
        if (store) {
            store.userId = userId;
        }
    }
}
exports.RequestContext = RequestContext;
