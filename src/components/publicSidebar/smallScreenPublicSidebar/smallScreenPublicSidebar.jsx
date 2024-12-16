'use client';
import React, { useEffect, useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { AiOutlineClose } from 'react-icons/ai';
import IconButton from '../../common/iconButton';
import PublicSidebar from '../publicSidebar';
import './smallScreenPublicSidebar.scss';

export default function SmallScreenPublicSidebar({ sidebarData, customDomain }) {
  const [isPublicSidebarOpen, setIsPublicSidebarOpen] = useState(false);

  useEffect(() => {
    setIsPublicSidebarOpen(false);
  }, []);

  const onHamburgerClick = () => {
    setIsPublicSidebarOpen(!isPublicSidebarOpen);
  };

  return (
    <>
      <div className='small-screen-header w-100 bg-white d-none py-4 px-2'>
        <IconButton onClick={onHamburgerClick}>
          <RxHamburgerMenu size={22} />
        </IconButton>
      </div>
      {isPublicSidebarOpen && (
        <div className='small-screen-sidebar-contianer pl-2 pt-4 bg-white'>
          <div className='w-100 bg-white'>
            <IconButton onClick={onHamburgerClick}>
              <AiOutlineClose size={22} />
            </IconButton>
          </div>
          <div className='mt-3 bg-white parent-container-sm-public-sidebar'>
            <PublicSidebar sidebarData={sidebarData} customDomain={customDomain} />
          </div>
        </div>
      )}
    </>
  );
}
