'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { IoHomeSharp, IoDocumentTextOutline } from 'react-icons/io5';
import { MdOutlineApi } from 'react-icons/md';
import { FaLongArrowAltLeft, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { createOrg } from '@/services/orgApiService';
import { addIsExpandedAction } from '@/store/clientData/clientDataActions';
import './onBoarding.scss';
import { getOrgId, redirectToDashboard } from '@/components/common/utility';
import IconButton from '@/components/common/iconButton';
import { addPage } from '@/components/pages/redux/pagesActions';
import { addCollection } from '@/components/collections/redux/collectionsActions';
import { onHistoryRemoved } from '@/components/history/redux/historyAction';
import { closeAllTabs } from '@/components/tabs/redux/tabsActions';

const OnBoarding = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [orgName, setOrgName] = useState('');
  const { tabs, history: historySnapshot } = useSelector((state) => ({
    tabs: state.tabs,
    history: state.history,
  }));
  const [isContinue, setIsContinue] = useState(true);
  const [isCardClicked, setCardClicked] = useState(false);

  const handleCardClick = (index) => {
    setSelectedIndex(index);
    setIsContinueEnabled(true);
    setCardClicked(true);
  };

  const handleContinueClick = () => {
    if (isContinue) {
      setShowInput(true);
      setIsInputVisible(true);
      setIsContinue(false);
    } else {
      handleAddOrg(selectedIndex);
    }
  };

  const handleBackClick = () => {
    setShowInput(false);
    setIsInputVisible(false);
    setIsContinue(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddOrg();
    }
  };

  const handleAddOrg = async (selectedIndex) => {
    try {
      if (!validateName(orgName)) {
        toast.error('Invalid organization name');
        return;
      }
      await handleNewOrgClick(selectedIndex);
    } catch (e) {
      toast.error('Something went wrong');
    }
  };

  const handleNewOrgClick = async (selectedIndex) => {
    try {
      const tabIdsToClose = tabs.tabsOrder;
      removeFromLocalStorage(tabIdsToClose);
      dispatch(closeAllTabs(tabIdsToClose));
      dispatch(onHistoryRemoved(historySnapshot));
      await createOrg(orgName, selectedIndex);
      const collection = await dispatch(
        addCollection({ name: 'Your Collection', orgDetails: { orgName } })
      );
      dispatch(addIsExpandedAction({ value: true, id: collection.id }));
      const rootParentId = collection?.rootParentId;
      await dispatch(addPage(rootParentId, { name: 'Document', pageType: 1 }));
    } catch (error) {
      throw error;
    }
  };

  const removeFromLocalStorage = (tabIds) => {
    tabIds.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const validateName = (orgName) => {
    const regex = /^[a-zA-Z0-9_ ]+$/;
    return (
      orgName &&
      regex.test(orgName) &&
      orgName?.length >= 3 &&
      orgName?.length <= 50
    );
  };

  return (
    <>
      <button
        className='btn home-button position-absolute btn-dark btn-sm'
        onClick={() => redirectToDashboard(getOrgId(), router)}
      >
        <IconButton>
          <IoHomeSharp size={18} />
        </IconButton>
      </button>
      {!isContinue && (
        <button
          className='btn back-button btn-dark position-absolute px-2'
          onClick={handleBackClick}
        >
          <FaLongArrowAltLeft size={18} />
        </button>
      )}
      <div className='onboarding-container position-relative d-flex flex-column align-items-center justify-content-center overflow-hidden'>
        <div
          className={`on-boarding d-flex flex-column align-items-center justify-content-center p-2 w-100 ${showInput ? 'slide-out' : ''}`}
        >
          <h2 className='mb-5'>How do you want to use techdoc?</h2>
          <div className='card-container d-flex flex-column flex-sm-row'>
            {['Light', 'Light'].map((variant, index) => (
              <div
                key={index}
                className='d-flex flex-column align-items-center justify-content-center'
              >
                <Card
                  bg={variant.toLowerCase()}
                  text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                  className={`card-main cursor-pointer ${selectedIndex === index ? 'active-tab bg-white' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <Card.Body>
                    <Card.Text
                      className={`card-text d-flex flex-column justify-content-center align-items-center h-100 ${
                        selectedIndex === index ? 'text-dark' : 'text-gray'
                      }`}
                    >
                      {index === 0 ? (
                        <div className='d-flex flex-column align-items-center'>
                          <IoDocumentTextOutline size={80} />
                          <div className='mt-3'>Documentation</div>
                        </div>
                      ) : (
                        <>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex flex-column align-items-center'>
                              <IoDocumentTextOutline size={80} />
                              <span className='mt-3'>Documentation</span>
                            </div>
                            <FaPlus size={16} className='mx-2' />
                            <div className='d-flex flex-column align-items-center'>
                              <MdOutlineApi className='ml-1' size={80} />
                              <span className='mt-3'>API</span>
                            </div>
                          </div>
                        </>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`input-container position-absolute d-flex align-items-center flex-column p-2 w-100 ${showInput ? 'show-in' : ''}`}
        >
          {isInputVisible && (
            <div className='input-group'>
              <InputGroup className='mb-3'>
                <Form.Control
                  className='rounded'
                  placeholder='Enter Organization Name'
                  type='text'
                  aria-label='Organization name'
                  aria-describedby='basic-addon2'
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  onKeyDown={(e) => {
                    handleKeyPress(e);
                  }}
                  isInvalid={orgName && !validateName(orgName)}
                  autoFocus
                />
              </InputGroup>
              <div className='d-flex'>
                <small className='muted-text'>
                  **Organization name accepts min 3 and max 50 characters
                </small>
              </div>
            </div>
          )}
        </div>
        <Button
          variant='secondary'
          className={`btn-Continue btn-btn-lg px-5 mt-5 ${isCardClicked ? 'bg-dark' : ''}`}
          disabled={!isContinueEnabled}
          onClick={handleContinueClick}
        >
          {isContinue ? 'Continue' : 'Create'}
        </Button>
      </div>
    </>
  );
};

export default OnBoarding;
