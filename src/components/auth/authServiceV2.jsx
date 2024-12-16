"use client";
import React, { useEffect } from "react";
import { switchOrg } from "@/services/orgApiService";
import axios from "axios";
import {
  setCurrentorganization,
  setOrganizationList,
} from "@/components/auth/redux/organizationRedux/organizationAction";
import { store } from "@/store/store";
import { setCurrentUser } from "@/components/auth/redux/usersRedux/userAction";
import { useRouter, useSearchParams } from "next/navigation";

export const tokenKey = "token";
export const profileKey = "profile";
const uiURL = process.env.NEXT_PUBLIC_UI_URL;
const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL;

function isAdmin() {
  return { is_admin: true };
}

async function getUserData(token) {
  try {
    const response = await axios.get(`${proxyUrl}/getUsers?itemsPerPage=100`, {
      headers: { proxy_auth_token: token },
    });
    return response?.data?.data?.data;
  } catch (e) {
    localStorageCleanUp();
    logoutRedirection("/login");
  }
}

async function logout() {
  const sessionToken = sessionStorage.getItem("sessionToken");
  if (sessionToken) {
    const currentOrg = getCurrentOrg();
    logoutRedirection(`orgs/${currentOrg?.id}/dashboard`);
    return;
  }

  try {
    if (localStorage.getItem("token")) await axios.delete(`${proxyUrl}/logout`);
    localStorageCleanUp();
    logoutRedirection("/login");
  } catch (e) {
    localStorageCleanUp();
    logoutRedirection("/login");
  }
}

function localStorageCleanUp() {
  localStorage.clear();
}

function logoutRedirection(redirectUrl) {
  const redirectUri = `${uiURL}/${redirectUrl.replace(/^\/+/, "")}`;
  window.location.href = redirectUri;
}

function getCurrentUser() {
  try {
    const profile = localStorage.getItem(profileKey);
    const parsedProfile = JSON.parse(profile);
    const desiredData = {
      id: parsedProfile.id,
      name: parsedProfile.name,
      email: parsedProfile.email,
      created_at: parsedProfile.created_at,
      updated_at: parsedProfile.updated_at,
      is_block: parsedProfile.is_block,
    };
    return desiredData;
  } catch (err) {
    return null;
  }
}

function getCurrentOrg() {
  try {
    const state = store?.getState();
    const currentOrganization = state?.organizations?.currentOrg;
    return currentOrganization;
  } catch (err) {
    return null;
  }
}

function getOrgList() {
  try {
    const state = store.getState();
    const organizationList = state?.organizations?.orgList;
    return organizationList;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getProxyToken() {
  const sessionTokenKey = "sessionToken";
  const tokenKey = "token";
  if (typeof window !== "undefined") {
    return (
      sessionStorage.getItem(sessionTokenKey) ||
      localStorage.getItem(tokenKey) ||
      ""
    );
  }
  return null;
}

async function getDataFromProxyAndSetDataToLocalStorage(
  proxyAuthToken,
  redirect,
) {
  if (!proxyAuthToken) {
    proxyAuthToken = getProxyToken();
  }

  localStorage.setItem(tokenKey, proxyAuthToken);
  try {
    const response = await fetch(`${proxyUrl}/getDetails`, {
      headers: {
        proxy_auth_token: proxyAuthToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const userInfo = data.data[0];
    localStorage.setItem(profileKey, JSON.stringify(userInfo));
    store.dispatch(setCurrentUser(userInfo));
    store.dispatch(setOrganizationList(userInfo.c_companies));
    store.dispatch(setCurrentorganization(userInfo.currentCompany));

    const currentOrgId = userInfo.currentCompany?.id;
    if (currentOrgId && redirect) {
      switchOrg(currentOrgId, redirect);
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

function AuthServiceV2() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proxyAuthToken = searchParams.get("proxy_auth_token");
        if (proxyAuthToken) {
          await getDataFromProxyAndSetDataToLocalStorage(proxyAuthToken, true);
        }
      } catch (err) {
        router.push("/logout");
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="custom-loading-container">
      <progress className="pure-material-progress-linear w-25" />
    </div>
  );
}

export default AuthServiceV2;
export {
  isAdmin,
  getUserData,
  getCurrentUser,
  getCurrentOrg,
  getOrgList,
  getProxyToken,
  logout,
  getDataFromProxyAndSetDataToLocalStorage,
};
