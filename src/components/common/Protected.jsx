'use-client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Protected = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    useEffect(() => {
      if (
        typeof window !== 'undefined' &&
        !localStorage.getItem('token') &&
        !sessionStorage.getItem('sessionToken')
      ) {
        router.replace('/');
      }
    }, [router]);
    if (
      !localStorage.getItem('token') &&
      !sessionStorage.getItem('sessionToken')
    )
      return null;
    return <WrappedComponent {...props} />;
  };
};

export default Protected;
