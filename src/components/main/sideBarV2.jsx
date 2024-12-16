'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import moment from 'moment';
import Collections from '../collections/collections';
import './main.scss';
import {
  isDashboardRoute,
  getOnlyUrlPathById,
  SESSION_STORAGE_KEY,
  getUrlPathById,
  isTechdocOwnDomain,
} from '../common/utility';
import {
  getCurrentUser,
  getOrgList,
  getCurrentOrg,
} from '../auth/authServiceV2';
import EmptyHistory from '@/assets/icons/emptyHistroy.svg';
import NoFound from '@/assets/icons/noCollectionsIcon.svg';
import SearchIcon from '@/assets/icons/search.svg';
import UserProfileV2 from './userProfileV2';
import { updateDragDrop } from '../pages/redux/pagesActions';
import customPathnameHook from '../../customHook/customPathnameHook';
import './sidebar.scss';

const SideBar = () => {
  const collections = useSelector((state) => state.collections);
  const pages = useSelector((state) => state.pages);
  const historySnapshot = useSelector((state) => state.history);
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const dispatch = useDispatch();

  const update_drag_and_drop = (draggedId, droppedOnId, pageIds) =>
    dispatch(updateDragDrop(draggedId, droppedOnId, pageIds));

  const router = useRouter();
  const location = customPathnameHook();
  const params = useParams();
  const searchParams = useSearchParams();

  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [searchData, setSearchData] = useState({ filter: '' });
  const [draggingOverId, setDraggingOverId] = useState(null);
  const [draggedIdSelected, setDraggedIdSelected] = useState(null);
  const [filteredHistorySnapshot, setFilteredHistorySnapshot] = useState([]);
  const [filteredEndpoints, setFilteredEndpoints] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', handleShortcutKeys);
    return () => {
      document.removeEventListener('keydown', handleShortcutKeys);
    };
  }, []);

  const handleShortcutKeys = (event) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isContentEditable =
      event.target.getAttribute('contentEditable') === 'true';
    const isPageFocused = document.activeElement.closest(
      '.parent-page-container'
    );
    if (
      !isPageFocused &&
      ((isMac && event.metaKey && event.key === 'k') ||
        (!isMac && event.ctrlKey && event.key === 'k')) &&
      event.target.tagName !== 'INPUT' &&
      event.target.tagName !== 'TEXTAREA' &&
      !isContentEditable
    ) {
      event.preventDefault();
      inputRef.current.focus();
    }
  };

  function compareByCreatedAt(a, b) {
    const t1 = a?.createdAt;
    const t2 = b?.createdAt;
    let comparison = 0;
    if (t1 < t2) {
      comparison = 1;
    } else if (t1 > t2) {
      comparison = -1;
    }
    return comparison;
  }

  const handleOnChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const newData = { ...searchData, filter: e.target.value };
    let filteredHistorySnapshot = [];
    if (historySnapshot) {
      filteredHistorySnapshot = Object.values(historySnapshot).filter(
        (o) =>
          o.endpoint?.name?.toLowerCase().includes(searchTerm) ||
          o.endpoint?.BASE_URL?.toLowerCase().includes(searchTerm) ||
          o.endpoint?.uri?.toLowerCase().includes(searchTerm)
      );
    }
    let filteredEndpoints = [];
    let filteredPages = [];
    const sideBarData = pages;
    for (let key in sideBarData) {
      let o = sideBarData[key];
      if (
        o.name?.toLowerCase().includes(searchTerm) ||
        o.BASE_URL?.toLowerCase().includes(searchTerm) ||
        o.uri?.toLowerCase().includes(searchTerm)
      ) {
        sideBarData[key]?.type === 4
          ? filteredEndpoints.push(sideBarData[key])
          : filteredPages.push(sideBarData[key]);
      }
    }
    setSearchData(newData);
    setFilteredHistorySnapshot(filteredHistorySnapshot);
    setFilteredEndpoints(filteredEndpoints);
    setFilteredPages(filteredPages);
  };

  const renderSearch = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    return (
      <div
        tabIndex={0}
        className='d-flex align-items-center my-1 search-container'
      >
        <SearchIcon className='mr-2' />
        <input
          ref={inputRef}
          value={searchData.filter}
          className='search-input'
          placeholder={
            isMac ? 'Press ⌘ + K to search' : 'Press Ctrl + K to search'
          }
          autoComplete='off'
          type='text'
          name='filter'
          id='search'
          onChange={(e) => handleOnChange(e)}
        />
      </div>
    );
  };

  const openPage = (id) => {
    if (isDashboardRoute({ location })) {
      router.push(`/orgs/${params.orgId}/dashboard/page/${id}`);
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY.CURRENT_PUBLISH_ID_SHOW, id);
      let pathName = getUrlPathById(id, pages);
      pathName = isTechdocOwnDomain() ? `/p/${pathName}` : `/${pathName}`;
      router.push(pathName);
    }
  };

  const renderPath = (id, type) => {
    let path = '';
    const collectionId = pages[id]?.collectionId;

    switch (type) {
      case 'endpoint':
        path = `${collections[collectionId]?.name} > ${getOnlyUrlPathById(id, pages)}`;
        break;
      case 'page':
        path = `${collections[collectionId]?.name} > ${getOnlyUrlPathById(id, pages)}`;
        break;
      default:
        path = '';
        break;
    }

    return path ? (
      <div style={{ fontSize: '11px' }} className='text-muted'>
        {path}
      </div>
    ) : (
      <p />
    );
  };

  const renderPagesList = () => {
    return (
      <div>
        <div className='px-3'>Pages</div>
        <div className='py-3'>
          {pages &&
            filteredPages.map(
              (page, index) =>
                Object.keys(page)?.length !== 0 &&
                !(page?.type === 2 || page?.type === 0) && (
                  <div
                    className='btn d-flex align-items-center mb-2'
                    onClick={() => openPage(page.id)}
                    key={index}
                  >
                    <div>
                      <i className='uil uil-file-alt' aria-hidden='true' />
                    </div>
                    <div className='ml-3'>
                      <div className='sideBarListWrapper'>
                        <div className='text-left'>
                          <p>{page.name}</p>
                        </div>
                        {renderPath(page.id, 'page')}
                      </div>
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    );
  };

  const openEndpoint = (id) => {
    if (isDashboardRoute({ location })) {
      router.push(`/orgs/${params.orgId}/dashboard/endpoint/${id}`);
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY.CURRENT_PUBLISH_ID_SHOW, id);
      let pathName = getUrlPathById(id, pages);
      pathName = isTechdocOwnDomain() ? `/p/${pathName}` : `/${pathName}`;
      router.push(pathName);
    }
  };

  const renderEndpointsList = () => {
    return (
      <div>
        {filteredEndpoints?.length > 0 && <div className='px-3'>Endpoints</div>}
        <div className='py-3'>
          {filteredEndpoints?.length > 0 &&
            filteredEndpoints.map(
              (endpoint, index) =>
                Object.keys(endpoint)?.length !== 0 && (
                  <div
                    className='btn d-flex align-items-center mb-2'
                    onClick={() => openEndpoint(endpoint.id)}
                    key={index}
                  >
                    <div
                      className={`api-label lg-label ${endpoint.requestType}`}
                    >
                      <div className='endpoint-request-div'>
                        {endpoint.requestType}
                      </div>
                    </div>
                    <div className='ml-3'>
                      <div className='sideBarListWrapper'>
                        <div className='text-left'>
                          <p>
                            {endpoint.name || endpoint.BASE_URL + endpoint.uri}
                          </p>
                        </div>
                        {renderPath(endpoint.id, 'endpoint')}
                      </div>
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    );
  };

  const openHistorySnapshot = (id) => {
    router.push(`/orgs/${params.orgId}/dashboard/history/${id}`, {
      state: { historySnapshotId: id },
    });
  };

  const renderHistoryItem = (history) => {
    return (
      Object.keys(history)?.length !== 0 && (
        <div
          key={history.id}
          className='btn d-flex align-items-center mb-2'
          onClick={() => openHistorySnapshot(history?.id)}
        >
          <div
            className={`api-label lg-label ${history?.endpoint?.requestType}`}
          >
            <div className='endpoint-request-div'>
              {history?.endpoint?.requestType}
            </div>
          </div>
          <div className='ml-3'>
            <div className='sideBarListWrapper'>
              <div className='text-left'>
                <p>
                  {history?.endpoint?.name ||
                    history?.endpoint?.BASE_URL + history?.endpoint?.uri ||
                    'Random Trigger'}
                </p>
              </div>
              <small className='text-muted'>
                {moment(history.createdAt).format('ddd, Do MMM h:mm a')}
              </small>
            </div>
          </div>
        </div>
      )
    );
  };

  const renderHistoryList = () => {
    return (
      <div className='mt-3'>
        {filteredHistorySnapshot && filteredHistorySnapshot?.length > 0 ? (
          filteredHistorySnapshot
            .sort(compareByCreatedAt)
            .map((history) => renderHistoryItem(history))
        ) : (
          <div className='empty-collections'>
            <div>
              <EmptyHistory />
            </div>
            <div className='content'>
              <h5> No History available.</h5>
              <p />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSearchList = () => {
    if (searchData.filter?.length > 2) {
      if (isLoading) {
        return (
          <div className='d-flex justify-content-center align-items-center h-100 flex-d-col'>
            <span className='font-weight-700'>Loading...</span>
          </div>
        );
      }
      return filteredPages?.length > 0 ||
        filteredEndpoints?.length > 0 ||
        filteredHistorySnapshot?.length > 0 ? (
        <div className='searchResult h-100'>
          {filteredPages?.length > 0 ? renderPagesList() : null}
          {filteredEndpoints?.length > 0 ? renderEndpointsList() : null}
          {filteredHistorySnapshot?.length > 0 ? (
            <div>
              <div className='px-3'>History</div>
              {renderHistoryList()}
            </div>
          ) : null}
        </div>
      ) : (
        <div className='d-flex justify-content-center align-items-center h-100 flex-d-col'>
          <img src={NoFound} alt='' />
          <span className='font-weight-700'>No Results</span>
        </div>
      );
    }
  };

  const getAllChildIds = useCallback(
    async (pageId) => {
      let pageObject = pages?.[pageId];
      let childIds = [];
      if (pageObject?.child && pageObject?.child?.length > 0) {
        for (const childId of pageObject.child) {
          childIds.push(childId);
          childIds = childIds.concat(await getAllChildIds(childId));
        }
      }
      return childIds;
    },
    [pages]
  );

  const handleOnDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onDragEnter = useCallback((e, draggingOverId) => {
    e.preventDefault();
    setDraggingOverId(draggingOverId);
  }, []);

  const onDragEnd = useCallback((e) => {
    e.preventDefault();
    setDraggingOverId(null);
  }, []);

  const onDragStart = useCallback((draggedId) => {
    setDraggedIdSelected(draggedId);
  }, []);

  const onDrop = useCallback(
    async (e, droppedOnId) => {
      let pageIds = [];
      e.preventDefault();

      if (draggedIdSelected === droppedOnId) return;

      let draggedIdParent = pages?.[draggedIdSelected]?.parentId;
      let droppedOnIdParent = pages?.[droppedOnId]?.parentId;

      // Retrieve all child IDs of draggedId
      const draggedIdChilds = await getAllChildIds(draggedIdSelected);

      pageIds.push(...draggedIdChilds, draggedIdParent, droppedOnIdParent);

      update_drag_and_drop(draggedIdSelected, droppedOnId, pageIds);
    },
    [pages, draggedIdSelected, getAllChildIds, update_drag_and_drop]
  );

  const emptyFilter = () => {
    setSearchData((prevData) => ({ ...prevData, filter: '' }));
  };

  // Function to open a collection
  const openCollection = (collectionId) => {
    setSelectedCollectionId(collectionId);
  };

  // Rendering collections with handling logic
  const renderCollections = () => {
    const collectionsToRender = Object.keys(collections || {});
    return (
      <Collections
        handleOnDragOver={handleOnDragOver}
        onDragEnter={onDragEnter}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        onDrop={onDrop}
        draggingOverId={draggingOverId}
        collectionsToRender={collectionsToRender}
        selectedCollectionId={selectedCollectionId}
        empty_filter={emptyFilter}
        collection_selected={openCollection}
        filter={searchData.filter}
      />
    );
  };

  const renderSidebarContent = () => {
    return <div>{renderCollections()}</div>;
  };

  const renderDashboardSidebar = () => {
    let isOnDashboardPage = isDashboardRoute({ location });
    return (
      <>
        {isOnDashboardPage &&
          getCurrentUser() &&
          getOrgList() &&
          getCurrentOrg() && <UserProfileV2 />}
        <div className={`px-2 mx-1`}>
          {renderSearch()}
          {/* {isOnDashboardPage && renderGlobalAddButton()} */}
        </div>
        <div className='sidebar-content'>
          {searchData.filter !== '' && renderSearchList()}
          {searchData.filter === '' && renderSidebarContent()}
        </div>
      </>
    );
  };

  return (
    <>
      <nav className='sidebar'>
        <div
          className={`primary-sidebar w-100 gap-2 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        >
          {renderDashboardSidebar()}
        </div>
      </nav>
    </>
  );
};

export default SideBar;
