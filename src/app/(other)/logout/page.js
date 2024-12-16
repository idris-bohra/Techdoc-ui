'use client';
import { useEffect } from 'react';
import { logout } from '@/components/auth/authServiceV2';

const Logout = () => {
  useEffect(() => {
    logout();
  }, []);
  return null;
};

export default Logout;
