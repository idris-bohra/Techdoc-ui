"use client"
import React, { useEffect, useRef, useState } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import Combination from '../combination/combination'
import IconButton from '../../common/iconButton'
import { getPathForBreadcrumb, getUrlPathById, isTechdocOwnDomain } from '@/components/common/utility';
import { useDispatch, useSelector } from 'react-redux';
import { addIsExpandedAction } from '@/store/clientData/clientDataActions';
import { useRouter } from 'next/navigation';
import './endpoints.scss';
import { storeCurrentPublicId } from '@/store/publicStore/publicStoreActions';

export default function Endpoints({ endpointId, pages, collectionDetails, customDomain }) {

  const pathSlug = useSelector(state => state?.collections?.[Object.keys(state?.collections)?.[0]]?.path || "");
  const isExpanded = useSelector(state => state?.clientData?.[endpointId]?.isExpanded ?? false);
  const currentPublicId = useSelector(state => state?.publicStore?.currentPublicId);

  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  const endointDocRef = useRef();
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedEndpoint(currentPublicId);
  }, [currentPublicId]);

  const handleLinkClick = () => {
    sessionStorage.setItem('currentPublishIdToShow', endpointId);
    dispatch(storeCurrentPublicId(endpointId))
    let pathName = getUrlPathById(endpointId, pages);
    pathName = isTechdocOwnDomain()
      ? `/p/${pathName}`
      : pathSlug
        ? `/${pathSlug}/${pathName}`
        : `/${pathName}`;
    if (isExpanded) {
      router.push(pathName);
      return;
    }
    dispatch(addIsExpandedAction({ value: !isExpanded, id: endpointId }));
    router.push(pathName);
  };

  const toggleDoc = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(addIsExpandedAction({ value: !isExpanded, id: endpointId }));
  };

  const getPath = () => {
    const url = process.env.NEXT_PUBLIC_UI_URL;
    const { pathIds, versionId } = getPathForBreadcrumb(endpointId, pages, true);
    const pathsArray = pathIds.map((id) => {
      return pages[id].urlName;
    })
    const isVersionDefault = pages[versionId]?.state === 1;
    const path = pathsArray.join('/');
    if (collectionDetails?.path && customDomain) {
      return isVersionDefault ? `https://${customDomain}/${collectionDetails?.path}/${path}` : `https://${customDomain}/${collectionDetails?.path}/${path}?version=${pages[versionId]?.name}`
    }
    else if (customDomain) {
      return isVersionDefault ? `https://${customDomain}/${path}` : `https://${customDomain}/${path}?version=${pages[versionId]?.name}`
    }
    return `${url}/p/${path}?version=${pages[versionId]?.name}&collectionId=${collectionDetails?.id}`
  }

  return (
    <div className='endpoint-container w-100 my-1'>
      <a
        href={getPath()}
        id={endpointId}
        onClick={(e) => e.preventDefault()}
        className='text-decoration-none'
      >
        <div ref={endointDocRef} onClick={handleLinkClick} className={"d-flex justify-content-start align-items-center public-endpoint-main-container custom-link-style px-2 py-1 w-100 cursor-pointer" + ' ' + (selectedEndpoint === endpointId ? 'show-endpoint-bold' : '')}>
          <div className={(pages[endpointId]?.child?.length === 0 ? "visibility-hidden" : '') + ' ' + 'd-flex align-items-center'}>
            <IconButton onClick={toggleDoc} variant="sm">
              {!isExpanded ? <IoMdArrowDropright size={18} color='grey' className='public-arrow-icon' /> : <IoMdArrowDropdown size={18} color='grey' className='public-arrow-icon' />}
            </IconButton>
          </div>
          <div className='ml-1 inline-block cursor-pointer'>
            <span className='inline-block'>{pages[endpointId]?.name}</span>
            <span className={`mx-1 ${pages[endpointId]?.requestType}-TAB`}>{pages[endpointId]?.requestType}</span>
          </div>
        </div>
      </a>
      <div className='pl-2'>
        <Combination incomingPageId={endpointId} pages={pages} collectionDetails={collectionDetails} customDomain={customDomain} />
      </div>
    </div>
  );
}
