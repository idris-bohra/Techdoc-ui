'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getUrlPathById,
  isTechdocOwnDomain,
  SESSION_STORAGE_KEY,
} from '../common/utility';
import Providers from '../../app/providers/providers';
import ApiDocReview from '../apiDocReview/apiDocReview';
import { useSelector } from 'react-redux';
import PublicBreadCrumb from '../pages/publicBreadCrumb/publicBreadCrumb.tsx';
import './renderPageContent.scss'

export default function RenderPageContent(props) {
  const pathSlug = useSelector((state) => state?.collections?.[Object.keys(state?.collections || {})?.[0]]?.path || '');
  const [htmlWithIds, setHtmlWithIds] = useState('');
  const router = useRouter();

  function handleBreadcrumbClick(event) {
    const breadcrumbSegmentId = event.target.getAttribute('id');
    let id = breadcrumbSegmentId.split('/');
    if (id[0] === 'collection') {
      return;
    }
    id = id[1];
    sessionStorage.setItem(SESSION_STORAGE_KEY.CURRENT_PUBLISH_ID_SHOW, id);
    let pathName = getUrlPathById(id, props?.pages);
    pathName = isTechdocOwnDomain()
      ? `/p/${pathName}`
      : pathSlug
        ? `/${pathSlug}/${pathName}`
        : `/${pathName}`;
    router.push(pathName);
  }

  function handleLinkClick(event) {
    let id = event.target.getAttribute('data-page-id');
    sessionStorage.setItem(SESSION_STORAGE_KEY.CURRENT_PUBLISH_ID_SHOW, id);
    let pathName = getUrlPathById(id, props?.pages);
    pathName = isTechdocOwnDomain()
      ? `/p/${pathName}`
      : pathSlug
        ? `/${pathSlug}/${pathName}`
        : `/${pathName}`;
    router.push(pathName);
  }

  const addIdsToHeadings = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      heading.setAttribute('id', id);
      return {
        id,
        text: heading.innerText,
        tag: heading.tagName.toLowerCase(),
      };
    });
    const emptyParagraphs = doc.querySelectorAll('p:empty');
    emptyParagraphs.forEach((p) => {
      const br = doc.createElement('br');
      p.replaceWith(br);
    });
    return doc.body.innerHTML;
  };

  useEffect(() => {
    const html = addIdsToHeadings(props?.pageContentDataSSR?.contents);
    setHtmlWithIds(html);
  }, [props?.pageContentDataSSR?.contents]);

  useEffect(() => {
    setTimeout(() => {
      const getBtn = document.querySelectorAll('.breadcrumb-segment');
      getBtn.forEach((button) => {
        button.addEventListener('click', handleBreadcrumbClick);
      });
      const linkBtn = document.querySelectorAll('.linked-page');
      linkBtn.forEach((button) => {
        button.addEventListener('click', handleLinkClick);
      });
    }, 10);
  }, [props?.pageContentDataSSR?.contents]);

  return (
    <div className='d-flex flex-column w-100 align-items-start justify-content-between main-page-content-container'>
      {props?.pageContentDataSSR?.contents && (
        <div className='main-page-content w-100 d-flex flex-column doc-content-container justify-content-start align-items-start'>
          <PublicBreadCrumb />
          <div className='page-text-render d-flex justify-content-start align-items-center mt-3'>
            <h1
              className={`font-weight-bold border-0 d-flex align-items-center mt-0`}
            >
              {props?.pageContentDataSSR?.name}
            </h1>
          </div>
          <div className='page-text-render w-100 d-flex justify-content-start mt-3 tiptap'>
            <div id='__page__content' className='w-100'>
              <div
                className='page-content-body'
                dangerouslySetInnerHTML={{
                  __html: htmlWithIds || props?.pageContentDataSSR?.contents,
                }}
              />
            </div>
          </div>
        </div>
      )}
      {props?.pageContentDataSSR?.contents && (
        <div className='my-5 doc-review-container w-100 d-flex justify-content-center'>
          <Providers>
            <ApiDocReview />
          </Providers>
        </div>
      )}
    </div>
  );
}
