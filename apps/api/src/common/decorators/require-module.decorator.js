"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireModule = exports.MODULE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.MODULE_KEY = 'require_module';
const RequireModule = (moduleName) => (0, common_1.SetMetadata)(exports.MODULE_KEY, moduleName);
exports.RequireModule = RequireModule;
