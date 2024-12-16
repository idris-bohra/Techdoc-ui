'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import CustomModal from '@/components/customModal/customModal';
import { publicSearch } from '@/components/pages/pageApiService';
import { useSelector } from 'react-redux';
import Provider from '../../../app/providers/providers';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { getUrlPathById, isTechdocOwnDomain } from '@/components/common/utility';
import { debounce } from 'lodash';
import './publicSearchBar.scss';

function SearchLoader() {
  return (
    <p class='d-flex justify-content-center align-items-center w-100'>
      <div class='spinner-border' role='status'>
        <span class='sr-only'>Loading...</span>
      </div>
    </p>
  );
}

function SearchModal(props) {
  const { pages, pathSlug } = useSelector((state) => {
    return {
      pages: state.pages,
      pathSlug: state?.collections?.[Object.keys(state?.collections || {})?.[0]]?.path || '',
    };
  });
  const searchBarRef = useRef(null);
  const searchResultsRef = useRef([]);

  const router = useRouter();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchResultsWithTitle, setSearchResultsWithTitle] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let resultActiveIndex;
      const fullResultLength = searchResultsWithTitle?.length + searchResults?.length;
      if (event.key === 'ArrowDown') {
        if (activeIndex === fullResultLength - 1 || activeIndex === null) {
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) => prev + 1);
        }
      } else if (event.key === 'ArrowUp') {
        if (activeIndex === null || activeIndex === 0) {
          resultActiveIndex = fullResultLength - 1;
          setActiveIndex(resultActiveIndex);
        } else {
          setActiveIndex((prev) => prev - 1);
        }
      } else if (event.key === 'Enter') {
        let id;
        if (activeIndex >= searchResultsWithTitle.length) {
          const realIndexForPages = activeIndex - searchResultsWithTitle.length;
          id = searchResults[realIndexForPages];
        } else {
          id = searchResultsWithTitle[activeIndex];
        }
        if (id) {
          gotoPage(id);
          props?.openSearchModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchResults, activeIndex]);

  useEffect(() => {
    searchBarRef.current.focus();
  }, []);

  useEffect(() => {
    if (searchResultsRef.current?.[activeIndex]) {
      searchResultsRef.current[activeIndex].scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      });
    }
  }, [activeIndex]);

  const debouncedSearch = debounce(async (searchBarValue, host) => {
    const collectionId = sessionStorage.getItem('publicCollectionId');
    const pageIds = Object.keys(pages);
    const pageIdsResultant = [];
    pageIds.map((pageId) => {
      if (pages[pageId].name.toLowerCase().includes(searchBarValue.trim().toLowerCase()) && (pages?.[pageId]?.type === 1 || pages?.[pageId]?.type === 3 || pages?.[pageId]?.type === 4)) {
        pageIdsResultant.push(pageId);
      }
    });
    setSearchResultsWithTitle(pageIdsResultant);
    setLoading(true);
    let searchResults = [];
    try {
      searchResults = await publicSearch(searchBarValue, collectionId, host);
      const uniquePageIds = new Set();
      searchResults?.data?.result?.matches.forEach((vectorObject) => {
        const pageId = vectorObject?.metadata?.pageId || vectorObject?.metadata?.endpointId;
        uniquePageIds.add(pageId);
      });
      setSearchResults(Array.from(uniquePageIds) || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, 1000);

  const handleSearchInputChange = () => {
    const searchBarValue = searchBarRef.current.value;
    let host = window.location.host;
    if (process.env.NEXT_PUBLIC_UI_URLS.includes(host)) host = '';
    if (host.includes('127.0.0.1')) host = '127.0.0.1';
    if (searchBarValue.trim()?.length === 0) {
      setSearchResults([]);
      setSearchResultsWithTitle([]);
      setLoading(false);
      debouncedSearch.cancel();
    } else {
      debouncedSearch(searchBarValue, host);
    }
  };

  const appendRef = (element, index) => {
    searchResultsRef.current[index] = element;
  };

  const gotoPage = (id) => {
    let pathName = getUrlPathById(id, pages);
    pathName = isTechdocOwnDomain() ? `/p/${pathName}` : pathSlug ? `/${pathSlug}/${pathName}` : `/${pathName}`;
    router.push(pathName);
  };

  return (
    <div className='public-search-modal'>
      <div className='p-3 d-flex justify-content-start public-search-container align-items-center position-sticky top-0 bg-white'>
        <IoSearchSharp size={22} />
        <input
          ref={searchBarRef}
          onChange={handleSearchInputChange}
          type='text'
          className='form-control mx-2'
          placeholder='Search here'
        />
      </div>
      <div className='break-line mt-2' />
      {searchResultsWithTitle.length != 0 && (
        <>
          <h6 className='pl-3 fw-500 text-grey font-10'>Searched by Title</h6>
          {searchResultsWithTitle.map((pageId, index) => {
            if (!pages?.[pageId]?.name) return null;
            return (
              <div className='cursor-pointer w-100'>
                <div
                  ref={(e) => appendRef(e, index)}
                  onClick={() => gotoPage(pageId)}
                  className={
                    `d-flex py-2 pr-2 pl-4 flex-column justify-content-start search-content-container` +
                    ' ' +
                    (index === activeIndex ? 'active-search-content' : '')
                  }
                >
                  <h6 className='m-0 p-0 font-14'>{pages?.[pageId]?.name}</h6>
                </div>
              </div>
            );
          })}
        </>
      )}

      {searchResults.length !== 0 && (
        <>
          <hr />
          <h6 className='pl-3 fw-500 text-grey font-10'>Searched by Content</h6>
          {searchResults.map((id, index) => {
            if (!pages?.[id]?.name) return null;
            return (
              <div className='cursor-pointer w-100'>
                <div
                  ref={(e) =>
                    appendRef(e, index + searchResultsWithTitle.length)
                  }
                  onClick={() => gotoPage(id)}
                  className={
                    `d-flex py-2 pr-2 pl-4 flex-column justify-content-start search-content-container` +
                    ' ' +
                    (index === activeIndex - searchResultsWithTitle.length
                      ? 'active-search-content'
                      : '')
                  }
                >
                  <h6 className='m-0 p-0 font-14'>{pages?.[id]?.name}</h6>
                </div>
              </div>
            );
          })}
        </>
      )}
      {loading && <SearchLoader />}
    </div>
  );
}

export default function PublicSearchBar() {
  const [showSearchModal, setShowSearchModal] = useState(false);

  const openSearchModal = () => {
    setShowSearchModal(!showSearchModal);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowSearchModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='public-search-bar w-100 mb-3'>
      <div
        onClick={openSearchModal}
        className='form-control d-flex justify-content-start align-items-center public-sidebar-input'
      >
        Press ⌘ + K to search
      </div>
      <CustomModal onHide={openSearchModal} modalShow={showSearchModal}>
        <Provider>
          <SearchModal openSearchModal={openSearchModal} />
        </Provider>
      </CustomModal>
    </div>
  );
}
