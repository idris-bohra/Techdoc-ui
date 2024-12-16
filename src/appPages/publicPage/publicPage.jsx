'use client';
import React, { useEffect, useState } from 'react';
import RenderPageContent from '../../components/pages/renderPageContent';
import DisplayUserAndModifiedData from '../../components/common/userService';
import { IoDocumentTextOutline } from 'react-icons/io5';
import Providers from '../../app/providers/providers';
import { getProxyToken } from '../../components/auth/authServiceV2';
import { functionTypes } from '../../components/common/functionType';
import shortid from 'shortid';
import './publicPage.scss';
import { storeCurrentPublicId } from '@/store/publicStore/publicStoreActions';
import { useDispatch } from 'react-redux';

function PublicPage({ pageContentDataSSR, pages, widget_token }) {

  const dispatch = useDispatch();

  const [modifiedContent, setModifiedContent] = useState(
    pageContentDataSSR?.contents
  );

  useEffect(() => {
    let threadId = localStorage.getItem('threadId');

    if (!threadId) {
      threadId = shortid();
      localStorage.setItem('threadId', threadId);
    }

    if (modifiedContent) {
      const updatedContent = removeBreadCollections(modifiedContent);
      setModifiedContent(updatedContent);
    }

    const scriptId = 'chatbot-main-script';
    const chatbot_token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI1OTgyIiwiY2hhdGJvdF9pZCI6IjY2NTQ3OWE4YmQ1MDQxYWU5M2ZjZDNjNSIsInVzZXJfaWQiOiIxMjQifQ.aI4h6OmkVvQP5dyiSNdtKpA4Z1TVNdlKjAe5D8XCrew';
    const scriptSrc = 'https://chatbot-embed.viasocket.com/chatbot-prod.js';

    if (chatbot_token && !document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.setAttribute('embedToken', chatbot_token);
      script.id = scriptId;
      document.head.appendChild(script);
      script.src = scriptSrc;
    }

    const timer = setInterval(() => {
      if (typeof window?.SendDataToChatbot === 'function') {
        window?.SendDataToChatbot({
          bridgeName: 'page',
          threadId,
          helloId: widget_token,
          variables: {
            Proxy_auth_token: getProxyToken(),
            collectionId: pageContentDataSSR?.collectionId,
            functionType:
              process.env.NEXT_PUBLIC_ENV === 'prod'
                ? functionTypes.prod
                : functionTypes.dev,
          },
        });
        clearInterval(timer);
      }
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, [modifiedContent, pageContentDataSSR, pages, widget_token]);


  useEffect(() => {
    dispatch(storeCurrentPublicId(pageContentDataSSR?.id))
  }, [pageContentDataSSR?.id])

  const removeBreadCollections = (html) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const breadcrumbContainers = doc.querySelectorAll('.breadcrumb-container')

    breadcrumbContainers.forEach((container) => {
      const breadcrumbSegments = container.querySelectorAll('.breadcrumb-segment')

      breadcrumbSegments.forEach((button) => {
        if (button.id.startsWith('collection/')) {
          const nextElement = button.nextElementSibling
          button.remove()
          if (nextElement && nextElement.classList.contains('breadcrumb-separator')) {
            nextElement.remove()
          }
        }
      })
    })

    return doc.body.innerHTML
  }

  return (
    <div className={`custom-display-public-page w-100 overflow-auto`}>
      <div
        className={`page-wrapper d-flex flex-column ${modifiedContent ? 'justify-content-between' : 'justify-content-center'}`}
      >
        {modifiedContent && modifiedContent.trim() !== '<p></p>' ? (
          <div className='pageText d-flex justify-content-center align-items-start'>
            <RenderPageContent
              pageContentDataSSR={{
                ...pageContentDataSSR,
                contents: modifiedContent,
              }}
              pages={pages}
              webToken={widget_token}
            />
          </div>
        ) : (
          <div className='d-flex flex-column justify-content-center align-items-center empty-heading-for-page position-absolute'>
            <IoDocumentTextOutline size={140} color='gray' />
            <span className='empty-line'>
              {pageContentDataSSR?.name} is empty
            </span>
            <span className='mt-1 d-inline-block font-12'>
              <Providers>
                <DisplayUserAndModifiedData />
              </Providers>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicPage;
