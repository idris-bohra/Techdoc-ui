'use client';
import React, { useEffect } from 'react';
import httpService from '@/services/httpService';
import { store } from '@/store/store';
import { setCurrentUser } from '@/components/auth/redux/usersRedux/userAction';
import { setCurrentorganization } from '@/components/auth/redux/organizationRedux/organizationAction';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateMode } from '../../../../store/clientData/clientDataActions';
import { redirectToDashboard } from '../../../../components/common/utility';
import { getCurrentOrg } from '../../../../components/auth/authServiceV2';
import { toast } from 'react-toastify';

const profileKey = 'profile';
const apiURL = process.env.NEXT_PUBLIC_API_URL;

async function getDataFromBackendAndSetDataToLocalStorage(authToken) {
  try {
    const response = await httpService.get(
      `${apiURL}/p/get-sso-token?auth_token=${encodeURIComponent(authToken)}`
    );
    return response;
  } catch (e) {
    if (e?.response?.status === 301) {
      const { data } = e.response;
      const sessionTokenKey = 'sessionToken';
      sessionStorage.setItem(sessionTokenKey, data.token);
      store.dispatch(updateMode({ mode: true }));
      localStorage.setItem(profileKey, JSON.stringify(data.user));
      store.dispatch(setCurrentUser(data.user));
      store.dispatch(setCurrentorganization(data.company));
    } else {
      console.error('Error:', e);
      return null;
    }
  }
}

function SSOService() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = searchParams.get('auth_token');
        if (authToken) {
          localStorage.clear();
          await getDataFromBackendAndSetDataToLocalStorage(authToken);
          const orgId = getCurrentOrg()?.id;
          redirectToDashboard(orgId);
        } else {
          toast.error('server error!');
          router.push('/');
        }
      } catch (err) {
        localStorage.clear();
        router.push('/');
      }
    };

    fetchData();
  }, [router, searchParams]);

  return (
    <div className='custom-loading-container'>
      <progress className='pure-material-progress-linear w-25' />
    </div>
  );
}

export default SSOService;
