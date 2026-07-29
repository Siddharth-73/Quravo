"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireFeatureFlag = exports.FEATURE_FLAG_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.FEATURE_FLAG_KEY = 'feature_flag';
const RequireFeatureFlag = (flagKey) => (0, common_1.SetMetadata)(exports.FEATURE_FLAG_KEY, flagKey);
exports.RequireFeatureFlag = RequireFeatureFlag;
