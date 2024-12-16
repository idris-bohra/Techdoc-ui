import React from 'react';
import RenderPublicPageContent from '../p/[...slug]/page';
import { headers } from 'next/headers';

export default async function Page({ params, searchParams }) {
  const headersList = await headers();
  let host = headersList.get('host');
  if (host.includes('127.0.0.1')) host = '127.0.0.1';
  if (host !== 'localhost:3000')
    return (
      <RenderPublicPageContent
        params={params}
        searchParams={searchParams}
        customDomain={host}
      />
    );
}
