"use client";

import React, { createContext, useContext, useState } from 'react';

export interface ClinicBranch {
  id: string;
  name: string;
  code: string;
  isMain: boolean;
  city?: string;
}

interface BranchContextType {
  branches: ClinicBranch[];
  currentBranch: ClinicBranch | null;
  setCurrentBranch: (branch: ClinicBranch) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({
  children,
  initialBranches = [],
  initialCurrentBranch = null,
}: {
  children: React.ReactNode;
  initialBranches?: ClinicBranch[];
  initialCurrentBranch?: ClinicBranch | null;
}) {
  const [branches] = useState<ClinicBranch[]>(initialBranches);
  const [currentBranch, setCurrentBranch] = useState<ClinicBranch | null>(
    initialCurrentBranch || initialBranches[0] || null
  );

  return (
    <BranchContext.Provider value={{ branches, currentBranch, setCurrentBranch }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
}
