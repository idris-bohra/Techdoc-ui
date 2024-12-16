'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import customPathnameHook from '@/customHook/customPathnameHook';

function ERROR_404_PAGE() {
  const router = useRouter();
  const location = customPathnameHook();
  const message = location?.error?.response?.data;
  return (
    <div className='text-center errorPage'>
      <h4>OOPS! 404</h4>
      {message ? <h3>{message}</h3> : null}
      <button onClick={() => router.push('/')} mat-button>
        Return to Dashboard
      </button>
    </div>
  );
}

export default ERROR_404_PAGE;
