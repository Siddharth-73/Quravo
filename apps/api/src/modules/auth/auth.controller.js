"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const turnstile_guard_1 = require("./guards/turnstile.guard");
const rate_limiter_guard_1 = require("./guards/rate-limiter.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = (() => {
    let _classDecorators = [(0, common_1.Controller)('auth')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _register_decorators;
    let _login_decorators;
    let _refresh_decorators;
    let _logout_decorators;
    let _forgotPassword_decorators;
    let _resetPassword_decorators;
    let _getCurrentUser_decorators;
    let _getSession_decorators;
    let _updateProfile_decorators;
    var AuthController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _register_decorators = [(0, common_1.Post)('register'), (0, common_1.UseGuards)(turnstile_guard_1.TurnstileGuard)];
            _login_decorators = [(0, common_1.Post)('login'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseGuards)(rate_limiter_guard_1.RateLimiterGuard)];
            _refresh_decorators = [(0, common_1.Post)('refresh'), (0, throttler_1.SkipThrottle)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _logout_decorators = [(0, common_1.Post)('logout'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _forgotPassword_decorators = [(0, common_1.Post)('forgot-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _resetPassword_decorators = [(0, common_1.Post)('reset-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getCurrentUser_decorators = [(0, common_1.Get)('me'), (0, throttler_1.SkipThrottle)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
            _getSession_decorators = [(0, common_1.Get)('session'), (0, throttler_1.SkipThrottle)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
            _updateProfile_decorators = [(0, common_1.Put)('profile'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
            __esDecorate(this, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: obj => "register" in obj, get: obj => obj.register }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: obj => "login" in obj, get: obj => obj.login }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _refresh_decorators, { kind: "method", name: "refresh", static: false, private: false, access: { has: obj => "refresh" in obj, get: obj => obj.refresh }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: obj => "logout" in obj, get: obj => obj.logout }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _forgotPassword_decorators, { kind: "method", name: "forgotPassword", static: false, private: false, access: { has: obj => "forgotPassword" in obj, get: obj => obj.forgotPassword }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: obj => "resetPassword" in obj, get: obj => obj.resetPassword }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getCurrentUser_decorators, { kind: "method", name: "getCurrentUser", static: false, private: false, access: { has: obj => "getCurrentUser" in obj, get: obj => obj.getCurrentUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getSession_decorators, { kind: "method", name: "getSession", static: false, private: false, access: { has: obj => "getSession" in obj, get: obj => obj.getSession }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateProfile_decorators, { kind: "method", name: "updateProfile", static: false, private: false, access: { has: obj => "updateProfile" in obj, get: obj => obj.updateProfile }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        authService = __runInitializers(this, _instanceExtraInitializers);
        constructor(authService) {
            this.authService = authService;
        }
        setAuthCookies(res, accessToken, refreshToken) {
            const isProd = process.env.NODE_ENV === 'production';
            res.cookie('quravo_access_token', accessToken, {
                httpOnly: true,
                secure: isProd,
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000,
                path: '/',
            });
            res.cookie('quravo_refresh_token', refreshToken, {
                httpOnly: true,
                secure: isProd,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/v1/auth/refresh',
            });
        }
        async register(dto) {
            return this.authService.register(dto);
        }
        async login(dto, res) {
            const result = await this.authService.login(dto);
            this.setAuthCookies(res, result.accessToken, result.refreshToken);
            return { message: 'Logged in successfully', user: result.user, accessToken: result.accessToken };
        }
        async refresh(req, res) {
            const refreshToken = req.cookies?.['quravo_refresh_token'] || req.body?.refreshToken;
            if (!refreshToken) {
                res.clearCookie('quravo_access_token');
                res.clearCookie('quravo_refresh_token');
                return { status: 'logged_out' };
            }
            const result = await this.authService.refreshToken(refreshToken);
            this.setAuthCookies(res, result.accessToken, result.refreshToken);
            return { status: 'refreshed', user: result.user };
        }
        async logout(res) {
            res.clearCookie('quravo_access_token', { path: '/' });
            res.clearCookie('quravo_refresh_token', { path: '/api/v1/auth/refresh' });
            return { message: 'Logged out successfully' };
        }
        async forgotPassword(dto) {
            return this.authService.forgotPassword(dto);
        }
        async resetPassword(dto) {
            return this.authService.resetPassword(dto);
        }
        async getCurrentUser(req) {
            return { user: req.user };
        }
        async getSession(req) {
            const userId = req.user.userId;
            const tenantId = req.user.tenantId;
            const role = req.user.role;
            return this.authService.getSession(userId, tenantId, role);
        }
        async updateProfile(req, dto) {
            const userId = req.user.userId;
            return this.authService.updateProfile(userId, dto);
        }
    };
    return AuthController = _classThis;
})();
exports.AuthController = AuthController;
