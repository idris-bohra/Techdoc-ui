'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from '../splitPane/splitPane';
import jwt from 'jsonwebtoken';
import { addUserData } from '../auth/redux/usersRedux/userAction';
import ContentPanel from './contentPanel';
import SideBarV2 from './sideBarV2';
import OnlineStatus from '../onlineStatus/onlineStatus';
import DesktopAppDownloadModal from './desktopAppPrompt';
import UpdateStatus from './updateStatus';
import {
  getCurrentUser,
  getUserData,
  getProxyToken,
} from '../auth/authServiceV2';
import NoCollectionIcon from '@/assets/icons/collection.svg';
import { useRouter } from 'next/navigation';
import CollectionForm from '../collections/collectionForm';
import CustomModal from '../customModal/customModal';
import ShortcutModal from '../shortcutModal/shortcutModal';
import Protected from '../common/Protected';
import { updateMode } from '../../store/clientData/clientDataActions';
import { addCollectionAndPages } from '../redux/generalActions';
import { isOnPublishedPage } from '../common/utility';
import 'react-toastify/dist/ReactToastify.css';
import './main.scss';
import useExposeReduxState from '@/utilities/useExposeReduxState';

const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

const MainV2 = () => {
  useExposeReduxState();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections);
  const tabs = useSelector((state) => state?.tabs?.tabs);
  const activeTab = useSelector((state) => state?.tabs?.activeTabId);

  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddCollectionPage, setShowAddCollectionPage] = useState(true);
  const [showShortcutModal, setShowShortcutModal] = useState(false);

  useEffect(() => {
    const orgId = params.orgId;
    const checkSessionToken = sessionStorage.getItem('sessionToken');
    if (checkSessionToken) dispatch(updateMode({ mode: true }));
    else dispatch(updateMode({ mode: false }));

    const initialize = async () => {
      const token = checkSessionToken || getProxyToken();
      if (!token) {
        router.push('/login');
        return;
      }
      const users = await getUserData(token);
      if (users) dispatch(addUserData(users));
      if (process.env.NEXT_PUBLIC_ENV === 'local') {
        const userData = users[0];
        let techdocToken = jwt.sign({ user: userData }, secretKey, {
          expiresIn: '48h',
        });
        localStorage.setItem('techdoc_auth', techdocToken);
      }
      dispatch(addCollectionAndPages(orgId, isOnPublishedPage()));
      setLoading(false);
    };

    initialize();

    window.addEventListener('keydown', addShortCutForShortcutModal);

    if (activeTab !== null && typeof tabs[activeTab]?.type !== 'undefined') {
      if (tabs[activeTab]?.type === 'collection')
        router.push(
          `/orgs/${orgId}/dashboard/${tabs[activeTab]?.type}/${activeTab}/settings`
        );
      else
        router.push(
          `/orgs/${orgId}/dashboard/${tabs[activeTab]?.type}/${activeTab}`
        );
    } else router.push(`/orgs/${orgId}/dashboard`);

    return () => {
      window.removeEventListener('keydown', addShortCutForShortcutModal);
    };
  }, []);

  const setVisitedOrgs = () => {
    const orgId = params.orgId;
    const org = {};
    org[orgId] = true;
    window.localStorage.setItem('visitedOrgs', JSON.stringify(org));
  };

  const showCollectionDashboard = () => {
    if (!getCurrentUser()) {
      return false;
    }
    const collectionLength = Object.keys(collections)?.length;
    const orgId = params.orgId;
    const temp = JSON.parse(window.localStorage.getItem('visitedOrgs'));
    return (
      !(temp && temp[orgId]) && collectionLength === 0 && showAddCollectionPage
    );
  };

  const renderLandingDashboard = () => (
    <>
      <div className='no-collection d-flex flex-column justify-content-center align-items-center flex-grow-1'>
        <img src={NoCollectionIcon} alt='' />
        <p className='mb-4'>
          Add your first collection for API testing and Public API Doc
        </p>
        <button
          onClick={() => setShowAddCollectionModal(true)}
          className='btn btn-primary'
        >
          + Add collection
        </button>
        <p className='mt-3'>Or</p>
        <div
          className='text-link'
          onClick={() => {
            setVisitedOrgs();
            setShowAddCollectionPage(false);
          }}
        >
          Try Out Without a Collection
        </div>
      </div>
    </>
  );

  const addShortCutForShortcutModal = async () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    if (
      (isMac && event.metaKey && event.key === '/') ||
      (!isMac && event.ctrlKey && event.key === '/')
    ) {
      event.preventDefault();
      handleShortcutModal();
    }
  };

  const handleAddNewClick = () => {
    setShowAddCollectionModal((prev) => !prev);
  };

  const handleShortcutModal = () => {
    setShowShortcutModal((prev) => !prev);
  };

  return (
    <>
      {loading ? (
        <div className='custom-loading-container'>
          <progress className='pure-material-progress-linear w-25' />
        </div>
      ) : (
        <>
          <div className='custom-main-container min-h-100vh w-100'>
            <DesktopAppDownloadModal />
            <OnlineStatus />
            <div className='main-panel-wrapper w-100 h-100'>
              <SideBarV2 />
              {showCollectionDashboard() ? (
                renderLandingDashboard()
              ) : (
                <ContentPanel />
              )}
            </div>
            <UpdateStatus />
          </div>
        </>
      )}
      <CustomModal
        size='sm'
        modalShow={showAddCollectionModal}
        hideModal={handleAddNewClick}
      >
        <CollectionForm title='Add new Collection' onHide={handleAddNewClick} />
      </CustomModal>
      <CustomModal
        size='sm'
        modalShow={showShortcutModal}
        onHide={handleShortcutModal}
      >
        <ShortcutModal hideModal={handleShortcutModal} />
      </CustomModal>
    </>
  );
};

export default Protected(MainV2);
