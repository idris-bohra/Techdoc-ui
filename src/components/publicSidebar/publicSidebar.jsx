'use client';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Combination from './combination/combination';
import PublicSearchBar from './publicSearchBar/publicSearchBar';
import CollectionDetails from './collectionDetails/collectionDetails';
import generalActionsTypes from '../redux/generalActionTypes';
import './publicSidebar.scss';

export default function PublicSidebar({ sidebarData, customDomain }) {
  const collectionDetails = sidebarData?.collections[Object.keys(sidebarData?.collections)[0]] || {};
  const invisiblePageId = collectionDetails?.rootParentId || '';
  const pages = sidebarData?.pages || {};

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: generalActionsTypes.ADD_COLLECTIONS,
      data: sidebarData.collections,
    });
    dispatch({
      type: generalActionsTypes.ADD_PAGES,
      data: sidebarData.pages,
    });
  }, [sidebarData])


  return (
    <div className='public-sidebar-container pb-5 pr-2'>
      {!collectionDetails?.docProperties?.defaultHeader && (
        <CollectionDetails
          collectionDetails={
            sidebarData?.collections[Object.keys(sidebarData?.collections)[0]]
          }
        />
      )}
      <PublicSearchBar />
      <Combination
        customDomain={customDomain}
        collectionDetails={collectionDetails}
        pages={pages}
        invisiblePageId={invisiblePageId}
      />
    </div>
  );
}
