import React from 'react';

export default function CollectionDetails({ collectionDetails }) {
  return (
    <div className='d-flex justify-content-between mb-2 align-items-center'>
      <div className='td-header gap-2 d-flex align-items-center'>
        {(collectionDetails?.favicon ||
          collectionDetails?.docProperties?.defaultLogoUrl) && (
          <div className='hm-sidebar-logo'>
            <img
              id='publicLogo'
              alt='public-logo'
              src={
                collectionDetails?.favicon
                  ? `data:image/png;base64,${collectionDetails?.favicon}`
                  : collectionDetails?.docProperties?.defaultLogoUrl
              }
              width='60'
              height='60'
            />
          </div>
        )}
        <h1 className='mb-0 font-20 fw-800'>
          {collectionDetails?.name.charAt(0).toUpperCase() +
            collectionDetails?.name.slice(1) || ''}
        </h1>
      </div>
    </div>
  );
}
