'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OauthPage() {
  const searchParams = useSearchParams();
  // Extract query parameters (code, state)
  const code = searchParams.get('code') || '';
  const state = searchParams.get('state') || '';
  // Use useEffect to run client-side logic
  useEffect(() => {
    // Get URL fragment from window location hash (for implicit OAuth flow)
    const fragment = window.location.hash.substring(1);
    const fragmentParams = fragment.split('&').reduce((params, param) => {
      const [key, value] = param.split('=');
      params[key] = value;
      return params;
    }, {});

    // Check for access_token (OAuth implicit flow) or authorization code
    if (fragmentParams.access_token) {
      window &&
        window.opener &&
        window.opener.postMessage(
          { techdocAuthenticationDetails: { implicitDetails: fragmentParams } },
          window.location.origin
        );
    } else if (code) {
      window &&
        window.opener &&
        window.opener.postMessage(
          { techdocAuthenticationDetails: { code, state } },
          window.location.origin
        );
    }

    // Timeout to close window after posting the message
    const closeWindowTimeout = setTimeout(() => {
      window.close();
    }, 1000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(closeWindowTimeout);
  }, [code, state]); // Dependencies added to re-run useEffect when `code` or `state` changes

  return (
    <div className='d-flex justify-content-center align-items-center h-100'>
      <div className='spinner-border' role='status'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
}
