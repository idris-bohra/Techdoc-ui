'use client';
import React, { useState, useEffect, useRef } from 'react';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import Combination from '../combination/combination';
import IconButton from '../../common/iconButton';
import {
  getUrlPathById,
  isTechdocOwnDomain,
} from '@/components/common/utility';
import { useDispatch, useSelector } from 'react-redux';
import { addIsExpandedAction } from '@/store/clientData/clientDataActions';
import { useRouter } from 'next/navigation';
import './parentDocument.scss';
import { storeCurrentPublicId } from '@/store/publicStore/publicStoreActions';

function ShowVersionDropdown({
  docId,
  pages,
  selectedVersionId,
  setSelectedVersionId,
}) {
  if (pages?.[docId]?.child?.length == 1) return null;

  const versionIdsHasPublishedPages = getVersionIdsWhichHasPublishedPages();

  function handleDropdownClick(e) {
    e.stopPropagation();
  }

  function getVersionIdsWhichHasPublishedPages() {
    const versionIds = pages?.[docId]?.child;
    return versionIds.map((versionId) => {
      if (pages[versionId]?.child?.length > 0) return versionId;
    });
  }

  return (
    <div onClick={handleDropdownClick} className='dropdown'>
      <div
        className='dropdown-toggle version-dropdown-selected-name'
        id='dropdownMenuButton'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded='false'
      >
        {pages[selectedVersionId]?.name}
      </div>
      <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
        {versionIdsHasPublishedPages.map((versionId) => {
          return (
            <a
              onClick={(e) => {
                e.preventDefault();
                setSelectedVersionId(versionId);
              }}
              className='dropdown-item'
            >
              {pages?.[versionId]?.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function ParentDocument({
  customDomain,
  collectionDetails,
  docId,
  pages,
}) {

  const pathSlug = useSelector(state => state?.collections?.[Object.keys(state?.collections || {})?.[0]]?.path || '');
  const isExpanded = useSelector(state => state?.clientData?.[docId]?.isExpanded ?? false);
  const currentPublicId = useSelector(state => state?.publicStore?.currentPublicId);

  const [selectedVersionId, setSelectedVersionId] = useState(getDefaultVersionId());
  const [selectedPage, setSelectedPage] = useState(null);

  const parentDocRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedPage(currentPublicId);
  }, [currentPublicId]);

  const handleLinkClick = (e) => {
    e.preventDefault();
    sessionStorage.setItem('currentPublishIdToShow', docId);
    dispatch(storeCurrentPublicId(docId))
    let pathName = getUrlPathById(docId, pages);
    pathName = isTechdocOwnDomain()
      ? `/p/${pathName}`
      : pathSlug
        ? `/${pathSlug}/${pathName}`
        : `/${pathName}`;
    if (isExpanded) {
      router.push(pathName);
      return;
    }
    dispatch(addIsExpandedAction({ value: !isExpanded, id: docId }));
    router.push(pathName);
  };

  const toggleDoc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addIsExpandedAction({ value: !isExpanded, id: docId }));
  };

  function getDefaultVersionId() {
    const versionIds = pages[docId]?.child;
    for (let versionId of versionIds) {
      if (pages[versionId]?.state == 1) return versionId;
    }
    return null;
  }

  const getPath = () => {
    const url = process.env.NEXT_PUBLIC_UI_URL;
    if (collectionDetails?.path && customDomain) {
      return `https://${customDomain}/${collectionDetails?.path}/${pages[docId]?.urlName}`
    }
    else if (customDomain) {
      return `https://${customDomain}/${pages[docId]?.urlName}`
    }
    return `${url}/p/${pages[docId]?.urlName}?collectionId=${collectionDetails?.id}`
  }

  return (
    <div className='documnet-container w-100 my-1'>
      <a
        href={getPath()}
        id={docId}
        onClick={(e) => e.preventDefault()}
        className='text-decoration-none'
      >
        <div ref={parentDocRef} onClick={handleLinkClick} className={"d-flex justify-content-start align-items-center custom-link-style px-2 py-1 w-100 parent-doc-container cursor-pointer" + ' ' + (selectedPage == docId ? 'show-doc-bold' : '')}>
          <div className={pages[docId]?.child?.length === 0 ? "visibility-hidden" : ''}>
            <IconButton onClick={toggleDoc} variant="sm">
              {!isExpanded ? <IoMdArrowDropright size={18} color='grey' className='public-arrow-icon' /> : <IoMdArrowDropdown size={18} color='grey' className='public-arrow-icon' />}
            </IconButton>
          </div>
          <span className={'ml-1 cursor-pointer inline-block'}>{pages[docId]?.name}</span>
          <div className="show-version-dropdown ml-3">
            <ShowVersionDropdown docId={docId} pages={pages} selectedVersionId={selectedVersionId} setSelectedVersionId={setSelectedVersionId} />
          </div>
        </div>
      </a>
      {isExpanded && <div className='pl-2'>
        <Combination collectionDetails={collectionDetails} customDomain={customDomain} incomingPageId={selectedVersionId ? selectedVersionId : getDefaultVersionId()} pages={pages} />
      </div>}
    </div>
  );
}
