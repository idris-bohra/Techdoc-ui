import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './publishModal.scss';
import { getUrlPathById, SESSION_STORAGE_KEY } from '../common/utility';
import { useSelector } from 'react-redux';
import { GoLink } from 'react-icons/go';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { GoGlobe } from 'react-icons/go';

function PublishModal({ onPublish, onUnpublish, id, collectionId, isContentChanged }) {

  const [disabledValue, setDisabledValue] = useState(null);
  const [disabledValueForDomain, setDisabledValueForDomain] = useState(null);
  const [save, setSave] = useState(true);

  const { pages, customDomain, path, isPublished } = useSelector((state) => ({
    pages: state.pages,
    customDomain: state.collections?.[collectionId]?.customDomain || '',
    path: state.collections?.[collectionId]?.path || '',
    isPublished: state?.pages[state.tabs.activeTabId]?.isPublished,
  }));

  useEffect(() => {
    let pathName = getUrlPathById(id, pages, collectionId);
    if (customDomain) {
      const updatedPathName = pathName.replace(/\?collectionId=[^&]+/, '');
      setDisabledValueForDomain(`/${updatedPathName}`);
    }
    setDisabledValue(`/${pathName}`);
    setSave(true);
  }, [collectionId, id, pages, customDomain]);

  const visiblePath1 = `${process.env.NEXT_PUBLIC_UI_URL}/p`;
  const basePath = customDomain ? `https://${customDomain}` : `/p`;
  const visiblePath2 = path ? `${basePath}/${path}` : `${basePath}`;

  const handlePublishClick = () => {
    let pathName = getUrlPathById(id, pages);
    setDisabledValue(`/${pathName}`);
    onPublish();
  };

  const handlePublish = () => {
    setSave(false);
    onPublish();
  };

  const handleUnpublishClick = () => {
    setSave(true);
    onUnpublish();
  };

  const getViewSiteUrl = () => {
    return customDomain ? `https://${customDomain}${path ? `/${path}` : ''}${disabledValueForDomain}` : `/p${disabledValue}`;
  };

  const handleCopy = () => {
    toast.success('Link copied!');
  };

  const showTooltips = (tooltipType) => {
    switch (tooltipType) {
      case 'path2':
        return (
          <Tooltip className='custom-tooltip' id='link-tooltip'>
            <div className='font-12 text-secondary'>
              <span>&nbsp;{visiblePath2 + disabledValueForDomain}</span>
            </div>
          </Tooltip>
        );
      case 'path1':
        return (
          <Tooltip className='custom-tooltip' id='link-tooltip'>
            <div className='font-12 text-secondary'>
              <span>&nbsp;{visiblePath1 + disabledValue}</span>
            </div>
          </Tooltip>
        );
    }
  };

  return (
    <div className='custom-modal d-flex flex-column align-items-center gap-6'>
      <div>
        {!isPublished ? (
          <div className='d-flex align-items-center flex-column text-container gap-1 pt-2'>
            <GoGlobe size={26} className='text-grey' />
            <p className='fw-600 font-14 m-0'>Publish to web</p>
            <p className='create d-flex align-items-center font-12 text-grey mt-0 mb-2'>
              Share your work with others
            </p>
          </div>
        ) : (
          customDomain && (
            <OverlayTrigger placement='bottom' overlay={showTooltips('path2')}>
              <div className='custom-input-wrapper mr-1 ml-1 mt-1 d-flex align-items-center border bg rounded'>
                <div className='align-items-center editable-input cursor-pointer w-50 p-1  border-right bg-white'>
                  <div className='d-flex align-items-center input'>
                    <div className='value overflow-hidden font-14 text-grey'>
                      {visiblePath2}
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-between flex-grow-1 cursor-pointer bg-white'>
                  <div className='disabled-input overflow-hidden p-1 pr-3 text-nowrap font-14 text-grey text'>
                    {disabledValueForDomain}
                  </div>
                  <div className='d-flex align-items-center copy-buton'>
                    <div className='align-items-center icon cursor-pointer'>
                      <CopyToClipboard text={visiblePath2 + disabledValueForDomain} onCopy={handleCopy} >
                        <GoLink className='mx-2' size={14} />
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
              </div>
            </OverlayTrigger>
          )
        )}
        {isPublished && (
          <OverlayTrigger placement='bottom' overlay={showTooltips('path1')}>
            <div className='custom-input-wrapper d-flex align-items-center mt-2 border bg rounded'>
              <div className='align-items-center editable-input cursor-pointer bg-white w-50 p-1 border-right'>
                <div className='d-flex align-items-center input'>
                  <div className='value font-14 text-grey text-truncate'>
                    {visiblePath1}
                  </div>
                </div>
              </div>
              <div className='d-flex justify-content-between cursor-pointer bg-white flex-grow-1'>
                <a href={getViewSiteUrl()} target='_blank' rel='noopener noreferrer' className='text-decoration-none text-black'>
                  <div className='disabled-input overflow-hidden p-1 pr-3 text-nowrap font-14 text-grey text'>
                    {disabledValue}
                  </div>
                </a>
                <div className='d-flex align-items-center copy-buton'>
                  <div className='align-items-center icon cursor-pointer'>
                    <CopyToClipboard text={visiblePath1 + disabledValue} onCopy={handleCopy} >
                      <GoLink className='mx-2' size={14} />
                    </CopyToClipboard>
                  </div>
                </div>
              </div>
            </div>
          </OverlayTrigger>
        )}
      </div>
      <div className='d-flex align-items-center justify-content-end gap-2 publish-view-site-btn w-100'>
        {isContentChanged && save && isPublished && (
          <Button className='cursor-pointer d-flex align-items-center btn-sm font-12 view-site bg-primary py-2 px-3' onClick={handlePublish} >
            Publish
          </Button>
        )}
        {!isPublished ? (
          <Button className='cursor-pointer btn-sm font-12 publish-btn border-0 w-100 py-2 px-3' onClick={handlePublishClick} >
            Publish
          </Button>
        ) : (
          <Button className='cursor-pointer d-flex align-items-center btn-sm font-12 view-site unpublish-btn py-2 px-3 bg-danger' onClick={handleUnpublishClick} >
            Unpublish
          </Button>
        )}
      </div>
    </div>
  );
}

export default PublishModal;