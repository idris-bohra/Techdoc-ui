'use client';
import React from 'react';
import './publicHeader.scss';

export default function PublicHeader({ headerData }) {
  return (
    <div className='navbar-public border-bottom'>
      <div
        className='preview-content mx-auto'
        dangerouslySetInnerHTML={{ __html: headerData }}
      />
    </div>
  );
}
