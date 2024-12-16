'use client';

import { useEffect } from 'react';

export default function BootstrapProvider({ children }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return <>{children}</>;
}
