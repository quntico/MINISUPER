
import React from 'react';
import { useCompany } from '../../core/contexts/CompanyContext.jsx';

export const FeatureGate = ({ feature, children, fallback = null }) => {
  const { company, isLoading } = useCompany();

  if (isLoading) return null;

  const hasFeature = company?.features?.[feature] === true;

  if (!hasFeature) {
    return fallback;
  }

  return <>{children}</>;
};
