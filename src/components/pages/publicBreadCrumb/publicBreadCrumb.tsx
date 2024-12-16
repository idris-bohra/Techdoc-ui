'use client';
import React, { useEffect, useState } from 'react';
import {
  getPathForBreadcrumb,
  getUrlPathById,
  isTechdocOwnDomain,
} from '@/components/common/utility';
import { IoIosArrowForward } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { storeCurrentPublicId } from '@/store/publicStore/publicStoreActions';

interface stateDataType {
  collections: any;
  pages: any;
  publicStore: {
    currentPublicId: string;
  };
}

export default function PublicBreadCrumb(): JSX.Element {
  const dispatch = useDispatch();

  const pathSlug = useSelector((state: stateDataType) => state?.collections?.[Object.keys(state?.collections || {})?.[0]]?.path || '');
  const collectionData = useSelector((state: stateDataType) => state?.collections?.[Object.keys(state?.collections || {})?.[0]] || '');
  const pages = useSelector((state: stateDataType) => state?.pages ?? []);
  const currentPublicId = useSelector((state: stateDataType) => state?.publicStore?.currentPublicId);

  const router = useRouter();

  const [publicBreadCrumbPageIds, setPublicBreadCrumbPageIds] = useState<string[]>([]);

  useEffect(() => {
    const breadcrumbData = getPathForBreadcrumb(currentPublicId, pages);
    const pathIds = Array.isArray(breadcrumbData) ? breadcrumbData : breadcrumbData.pathIds;
    setPublicBreadCrumbPageIds(pathIds);
  }, [currentPublicId])

  const handlePageClick = (pageIdToRedirect: string): void => {
    dispatch(storeCurrentPublicId(pageIdToRedirect));
    let pathName = getUrlPathById(pageIdToRedirect, pages)
    pathName = isTechdocOwnDomain() ? `/p/${pathName}` : pathSlug ? `/${pathSlug}/${pathName}` : `/${pathName}`;
    router.push(pathName);
  }

  return (
    <div className='public-bread-crumb d-flex justify-content-start align-items-center'>
      <div className='d-flex justify-content-start align-items-center text-secondary'>
        <span>{collectionData?.name}</span>
        <IoIosArrowForward className='mx-2' />
      </div>
      {publicBreadCrumbPageIds?.map((pageId: string, index: number): JSX.Element => {
        const isLast = index === publicBreadCrumbPageIds.length - 1;
        return (
          <div onClick={() => handlePageClick(pageId)} className={`d-flex justify-content-start align-items-center cursor-pointer ${isLast ? '' : 'text-secondary'}`}>
            <span>{pages?.[pageId]?.name}</span>
            {!isLast && <IoIosArrowForward className='mx-2' />}
          </div>
        )
      })}
    </div>
  )
}
