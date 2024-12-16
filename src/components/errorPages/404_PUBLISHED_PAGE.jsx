'use client'
import React from 'react';
import { useSelector } from 'react-redux';
import './404_PAGE.scss'

const ERROR_404_PUBLISHED_PAGE = () => {

  const { customDomain, path, collectionId } = useSelector((state) => ({
    customDomain: state?.collections?.[Object.keys(state?.collections || {})?.[0]]?.customDomain || '',
    path: state?.collections?.[Object.keys(state?.collections || {})?.[0]]?.path || '',
    collectionId: state?.collections?.[Object.keys(state?.collections || {})?.[0]]?.id || '',
  }));

  return (
    <div className="wrapper">
      <div className="error-panel-wrap">
        <div className="error-panel">
          <img src="https://i.gifer.com/8noy.gif" alt="Error" />
          <div className="error-heading">404</div>
          <div className="error-subheading">Page not Found</div>
          <div className="error-description">
            Oops! we couldn't find the page you are looking for, Please retry with correct url or contact us if you
            are having an issue.
          </div>
          <button className="mt-1 btn btn-outline bg-transparent"><a className="btn" href={customDomain ? `https://${customDomain}${path ? `/${path}` : ''}` : `${process.env.NEXT_PUBLIC_UI_URL}/p?collectionId=${collectionId}`}>Go to Home</a></button>
        </div>
      </div>
    </div>
  );
};

export default ERROR_404_PUBLISHED_PAGE;