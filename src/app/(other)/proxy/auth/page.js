'use client';
import React, { useEffect } from 'react';
import { switchOrg } from '@/services/orgApiService';
import {
  setCurrentorganization,
  setOrganizationList,
} from '@/components/auth/redux/organizationRedux/organizationAction';
import { store } from '@/store/store';
import { setCurrentUser } from '@/components/auth/redux/usersRedux/userAction';
import { useRouter, useSearchParams } from 'next/navigation';

const tokenKey = 'token';
const profileKey = 'profile';
const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL;

async function getDataFromProxyAndSetDataToLocalStorage(
  proxyAuthToken,
  redirect
) {
  localStorage.setItem(tokenKey, proxyAuthToken);

  try {
    const response = await fetch(`${proxyUrl}/getDetails`, {
      headers: {
        proxy_auth_token: proxyAuthToken,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const userInfo = data.data[0];
    localStorage.setItem(profileKey, JSON.stringify(userInfo));
    store.dispatch(setCurrentUser(userInfo));
    store.dispatch(setOrganizationList(userInfo.c_companies));
    store.dispatch(setCurrentorganization(userInfo.currentCompany));
    const currentOrgId = userInfo.currentCompany?.id;
    if (currentOrgId && redirect) switchOrg(currentOrgId, redirect);
  } catch (e) {
    console.error('Error:', e);
  }
}

function AuthServiceV2() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proxyAuthToken = searchParams.get('proxy_auth_token');
        if (proxyAuthToken)
          await getDataFromProxyAndSetDataToLocalStorage(proxyAuthToken, true);
      } catch (err) {
        router.push('/logout');
      }
    };
    fetchData();
  }, [router]);

  return (
    <div className='custom-loading-container'>
      <progress className='pure-material-progress-linear w-25' />
    </div>
  );
}

export default AuthServiceV2;
