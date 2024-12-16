'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCurrentOrg,
  getCurrentUser,
  getProxyToken,
} from '@/components/auth/authServiceV2';
import { toast } from 'react-toastify';
import { inviteMembers, removeUser } from '@/services/orgApiService';
import { useSelector, useDispatch } from 'react-redux';
import {
  addNewUserData,
  removeUserData,
} from '@/components/auth/redux/usersRedux/userAction';
import { inviteuserMail } from '@/components/common/apiUtility';
import GenericModal from '@/components/main/GenericModal';
import './inviteTeam.scss';

function InviteTeam() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);
  const orgId = getCurrentOrg()?.id;

  const { users, currentUserEmail, currentOrgName } = useSelector((state) => {
    return {
      users: state.users.usersList,
      currentUserEmail: state.users.currentUser.email,
      currentOrgName: state.organizations.currentOrg.name,
    };
  });

  useEffect(() => {
    if (getCurrentOrg()?.is_readable) router.push(`/orgs/${orgId}/dashboard`);
    if (typeof window.SendDataToChatbot === 'function') {
      const userId = getCurrentUser()?.id;
      window.SendDataToChatbot({
        bridgeName: 'LandingPage',
        threadId: `${userId}`,
        variables: {
          senderEmail: currentUserEmail,
          organizationName: currentOrgName,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      inputRef.current.focus();
    }
  }, [showModal]);

  const handleBack = () => {
    router.push(`/orgs/${orgId}/dashboard`);
  };

  const handleInviteClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEmail('');
  };
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendInvite(e);
  };

  const handleRemoveMember = async (userId) => {
    setLoading(true);
    try {
      const response = await removeUser(userId);
      if (response?.status === 'success' || '200') {
        toast.success('User removed successfully');
        dispatch(removeUserData(userId));
      }
    } catch (error) {
      toast.error('Error removing member');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!validateEmail(email)) {
        toast.error('Invalid email format');
        return;
      }
      const extractedName = email
        .substring(0, email.indexOf('@'))
        .replace(/[^a-zA-Z]/g, '');
      const response = await inviteMembers(extractedName, email);
      if (response?.status == 'success' || '200') {
        dispatch(addNewUserData([response?.data?.data]));
        handleCloseModal();
        await inviteuserMail(email);
      }
    } catch (error) {
      toast.error('Cannot proceed at the moment. Please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className='navbar'>
        <button className='backButton' onClick={handleBack}>
          Dashboard
        </button>
        <h1 className='title'>Manage Team</h1>
      </nav>
      <div className='container'>
        <button
          className='btn btn-primary btn-sm font-12 inviteButton'
          onClick={handleInviteClick}
        >
          + Add Member
        </button>
        <GenericModal
          email={email}
          validateEmail={validateEmail}
          handleKeyPress={handleKeyPress}
          inputRef={inputRef}
          setEmail={setEmail}
          handleSendInvite={handleSendInvite}
          handleCloseModal={handleCloseModal}
          showModal={showModal}
          onHide={handleCloseModal}
          title='Add Member'
          showInputGroup
          loading={loading}
        />
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(users).map(([key, user]) => (
              <tr key={key}>
                <td>{user?.email}</td>
                <td>Admin</td>
                <td>
                  {user?.id !== getCurrentUser()?.id && (
                    <button
                      className='btn btn-danger btn-sm'
                      onClick={() => handleRemoveMember(user?.id)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default InviteTeam;
