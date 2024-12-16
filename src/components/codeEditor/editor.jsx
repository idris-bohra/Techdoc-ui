import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import { defaultHeader, defaultFooter } from './defaultBlock';
import { useSelector } from 'react-redux';
import { IoIosClose } from 'react-icons/io';
import './editor.scss';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

const Editor = ({
  tabs,
  setHeader,
  setFooter,
  onHide,
  saveAndPublishCollection,
}) => {
  const urlSegments = window.location.pathname.split('/');
  const collectionId = urlSegments[urlSegments.indexOf('collection') + 1];

  const headerFromRedux = useSelector(
    (state) => state.collections[collectionId]?.docProperties?.defaultHeader
  );
  const footerFromRedux = useSelector(
    (state) => state.collections[collectionId]?.docProperties?.defaultFooter
  );

  const [headerCode, setHeaderCode] = useState(null);
  const [footerCode, setFooterCode] = useState(null);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  useEffect(() => {
    setHeaderCode(headerFromRedux ? headerFromRedux : defaultHeader);
    setFooterCode(footerFromRedux ? footerFromRedux : defaultFooter);
  }, [headerFromRedux, footerFromRedux]);

  const handleHeaderChange = (newCode) => {
    setHeaderCode(newCode);
    setHeader(newCode);
  };

  const handleFooterChange = (newCode) => {
    setFooterCode(newCode);
    setFooter(newCode);
  };

  const renderTabContent = () => {
    switch (currentTabIndex) {
      case 0:
        return getHeaderHtml();
      case 1:
        return getFooterHtml();
      default:
        return null;
    }
  };

  const handleSave = () => {
    saveAndPublishCollection();
    onHide();
  };

  const getHeaderHtml = () => {
    return (
      <div className='header-section grid-wrapper h-100'>
        <div className='box d-flex flex-column w-100'>
          <h3 className='textblock mb-3' onClick={onHide}>
            Customize Your Header
          </h3>
          <AceEditor
            mode='html'
            theme='github'
            name='html_editor'
            onChange={handleHeaderChange}
            value={headerCode}
            fontSize={16}
            width='100%'
            editorProps={{ $blockScrolling: true }}
          />
        </div>

        <div className='preview-block'>
          <h4 className='textblock mb-3'>Preview </h4>
          <div
            className='preview-content'
            dangerouslySetInnerHTML={{ __html: headerCode }}
          />
        </div>
      </div>
    );
  };

  const getFooterHtml = () => {
    return (
      <div className='footer-section grid-wrapper h-100'>
        <div className='box d-flex flex-column w-100'>
          <h3 className='textblock mb-3'>Customize Your Footer</h3>
          <AceEditor
            mode='html'
            theme='github'
            name='html_editor'
            onChange={handleFooterChange}
            value={footerCode}
            fontSize={16}
            width='100%'
            editorProps={{ $blockScrolling: true }}
          />
        </div>

        <div className='preview-block'>
          <h4 className='textblock mb-3'>Preview</h4>
          <div
            className='preview-content'
            dangerouslySetInnerHTML={{ __html: footerCode }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className='wrapper h-100'>
      <div className='editor w-100 h-100 d-flex flex-column'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <ul className='nav d-flex gap-3' role='tablist'>
            {tabs &&
              tabs.map((tabName, index) => (
                <li
                  className={`nav-item py-1 fs-16 ${currentTabIndex === index ? 'border-bottom border-2 border-dark fw-600' : ''}`}
                  role='tab'
                  type='button'
                  key={index}
                  onClick={() => setCurrentTabIndex(index)}
                >
                  {tabName}
                </li>
              ))}
          </ul>
          <span
            className='close-btn cursor-pointer d-flex align-items-center justify-content-center rounded icon-button-sm'
            onClick={() => onHide()}
          >
            <IoIosClose />
          </span>
        </div>
        <div className='tab-content'>{renderTabContent()}</div>
      </div>
      <div className='btn-container w-100 my-3 d-flex align-items-center justify-content-end gap-3'>
        <button
          className='border rounded py-1 px-3 btn btn-outline-secondary'
          onClick={() => {
            handleSave();
          }}
        >
          Save and Republish
        </button>
        {/* <button className='border rounded py-1 px-3 btn btn-outline-secondary'>Correct With AI</button> */}
      </div>
    </div>
  );
};

export default Editor;
