import React from 'react';
import IndexWebsite from '../components/indexWebsite/indexWebsite';
import RenderPublicPageContent from './p/[...slug]/page';
import { headers } from 'next/headers';

export default async function Page({ params, searchParams }) {
  const headersList = await headers();
  let host = headersList.get('host');
  if (process.env.NEXT_PUBLIC_UI_URLS.includes(host)) return <IndexWebsite />;
  if (host.includes('127.0.0.1')) host = '127.0.0.1';
  return (
    <RenderPublicPageContent
      params={params}
      searchParams={searchParams}
      customDomain={host}
    />
  );
}
