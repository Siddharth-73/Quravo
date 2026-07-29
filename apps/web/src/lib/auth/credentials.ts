import { PermissionCode } from '@/providers/PermissionProvider';
import { TenantFeaturesMap } from '@/providers/FeatureFlagProvider';

export const fullFeatures: TenantFeaturesMap = {
  appointments: true,
  patients: true,
  billing: true,
  ehr: true,
  pharmacy: true,
  laboratory: true,
  inventory: true,
  hr: true,
  bedManagement: true,
  telemedicine: true,
  aiScribe: true,
  marketing: true,
  insurance: true,
};
