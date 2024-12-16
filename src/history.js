'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { setNavigate, setParams } from './navigationService';

const NavigationSetter = () => {
  const navigate = useRouter();
  const params = useParams();

  React.useEffect(() => {
    setNavigate(navigate);
    setParams(params);
  }, [navigate, params]);

  return null;
};

export default NavigationSetter;
