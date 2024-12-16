import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import RenderChilds from './renderChilds';
import './linkedPageModal.scss';

export default function LinkedPageModal({
  setShowModal,
  editor,
  linkedPage,
  setLinkedPage,
}) {
  const { collections, pages, activeTabId } = useSelector((state) => ({
    collections: state.collections,
    pages: state.pages,
    activeTabId: state.tabs.activeTabId,
  }));
  const modalRef = useRef();
  useEffect(() => {
    if (activeTabId && pages[activeTabId]?.collectionId) {
      setLinkedPage([pages[activeTabId].collectionId]);
    }
  }, [activeTabId, pages, setLinkedPage]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowModal]);

  const [selectedPage, setSelectedPage] = useState(null);

  const getName = (id) => {
    const type = pages?.[id]?.type;
    if (type === 0) {
      const parentId = pages?.[id]?.collectionId;
      return collections?.[parentId]?.name;
    } else {
      return pages?.[id]?.name;
    }
  };

  const handleGoBack = (index) => {
    if (index >= 0 && index < linkedPage?.length - 1) {
      const tempPathData = linkedPage.slice(0, index + 1);
      setLinkedPage(tempPathData);
    } else {
      console.error('Invalid index provided.');
    }
  };

  const addLink = () => {
    if (!editor || !selectedPage) return;
    editor
      .chain()
      .focus()
      .setLinkedPage(selectedPage.id, selectedPage.name)
      .run();
    setShowModal(false);
  };

  return (
    <div className='linked-page-modal' ref={modalRef}>
      <div className='modal-header'>
        <span className='modal-title mt-2'>Link to</span>
        <div className='path-navigation'>
          {linkedPage.map((singleId, index) => (
            <div
              className='d-flex justify-content-start align-items-center'
              key={index}
            >
              {index !== 0 && <span className='ml-1'>/</span>}
              <div
                onClick={() => handleGoBack(index)}
                className='ml-1 tab-line'
              >
                {index === 0
                  ? collections?.[singleId]?.name
                  : getName(singleId)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='modal-body'>
        <div className='showcase_modal_container'>
          <RenderChilds
            editor={editor}
            linkedPage={linkedPage}
            setLinkedPage={setLinkedPage}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        </div>
      </div>

      <div className='modal-footer'>
        <button
          onClick={addLink}
          className='btn btn-primary'
          disabled={!selectedPage}
        >
          Link Page
        </button>
      </div>
    </div>
  );
}
