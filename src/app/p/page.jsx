import React from 'react';
import RenderPublicContent from './[...slug]/page';

export default function Page({ params, searchParams }) {
  return <RenderPublicContent params={params} searchParams={searchParams} />;
}
