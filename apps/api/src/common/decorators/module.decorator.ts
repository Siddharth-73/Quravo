import { SetMetadata } from '@nestjs/common';
import { ModuleKey } from '@quravo/common';

export const MODULE_KEY = 'module';
export const RequireModule = (moduleKey: ModuleKey) => SetMetadata(MODULE_KEY, moduleKey);
