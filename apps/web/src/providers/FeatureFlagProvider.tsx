"use client";

import React, { createContext, useContext, useState } from 'react';

export type FeatureFlagKey =
  | 'appointments'
  | 'patients'
  | 'billing'
  | 'ehr'
  | 'pharmacy'
  | 'laboratory'
  | 'inventory'
  | 'hr'
  | 'telemedicine'
  | 'aiScribe'
  | 'marketing'
  | 'bedManagement'
  | 'insurance';

export type TenantFeaturesMap = Record<FeatureFlagKey, boolean>;

const defaultFeatures: TenantFeaturesMap = {
  appointments: true,
  patients: true,
  billing: true,
  ehr: true,
  pharmacy: false,
  laboratory: false,
  inventory: false,
  hr: false,
  telemedicine: false,
  aiScribe: false,
  marketing: false,
  bedManagement: false,
  insurance: false,
};

interface FeatureFlagContextType {
  features: TenantFeaturesMap;
  hasFeature: (featureKey: FeatureFlagKey) => boolean;
  setFeatures: (features: Partial<TenantFeaturesMap>) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({
  children,
  initialFeatures = defaultFeatures,
}: {
  children: React.ReactNode;
  initialFeatures?: Partial<TenantFeaturesMap>;
}) {
  const [features, setFeaturesState] = useState<TenantFeaturesMap>({
    ...defaultFeatures,
    ...initialFeatures,
  });

  const hasFeature = (featureKey: FeatureFlagKey): boolean => {
    return !!features[featureKey];
  };

  const setFeatures = (newFeatures: Partial<TenantFeaturesMap>) => {
    setFeaturesState((prev) => ({ ...prev, ...newFeatures }));
  };

  return (
    <FeatureFlagContext.Provider value={{ features, hasFeature, setFeatures }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}
