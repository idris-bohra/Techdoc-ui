'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DisplayEndpoint from '../endpoints/displayEndpoint';
import { storeCurrentPublicId } from '@/store/publicStore/publicStoreActions';
import './publicEndpoint.scss';
import { createNewPublicEnvironment } from '../publishDocs/redux/publicEnvActions';

function PublicEndpoint(props) {

  const dispatch = useDispatch();

  const collections = useSelector((state) => state.collections);
  const pages = useSelector((state) => state.pages);
  const idToRender = props?.pageContentDataSSR?.id;
  const type = props?.pageContentDataSSR?.type || pages?.[idToRender]?.type;
  const collectionId = pages?.[idToRender]?.collectionId ?? null;
  let collectionTheme;
  if (collectionId) {
    collectionTheme = collections[collectionId]?.theme;
  }

  useEffect(() => {
    const scriptId = 'chatbot-main-script';
    const chatbot_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI1OTgyIiwiY2hhdGJvdF9pZCI6IjY2NTQ3OWE4YmQ1MDQxYWU5M2ZjZDNjNSIsInVzZXJfaWQiOiIxMjQifQ.aI4h6OmkVvQP5dyiSNdtKpA4Z1TVNdlKjAe5D8XCrew';
    const scriptSrc = 'https://chatbot-embed.viasocket.com/chatbot-prod.js';
    if (chatbot_token && !document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.setAttribute('embedToken', chatbot_token);
      script.id = scriptId;
      document.head.appendChild(script);
      script.src = scriptSrc;
    }
  }, []);

  useEffect(() => {
    dispatch(storeCurrentPublicId(props?.pageContentDataSSR?.id))
  }, [props?.pageContentDataSSR?.id]);

  useEffect(() => {
    dispatch(createNewPublicEnvironment(collections[collectionId]?.environment))
  }, [collectionId]);

  return (
    <div className='mainpublic-endpoint-main'>
      <div className={'hm-right-content'}>
        {(type == 4 || type == 5) && <DisplayEndpoint pageContentDataSSR={props?.pageContentDataSSR} publicCollectionTheme={collectionTheme} />}
      </div>
    </div>
  );
}

export default PublicEndpoint