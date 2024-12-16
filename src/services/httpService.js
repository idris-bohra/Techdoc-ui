'use client';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logout, getProxyToken } from '../components/auth/authServiceV2';
import { navigateTo } from '../navigationService';
import { isDashboardRoute } from '../components/common/utility';
import 'react-toastify/dist/ReactToastify.css';

let instance = axios.create();

instance.interceptors.response.use(null, (error) => {
  if (
    error.response.config.method === 'get' &&
    error.response.status === 404 &&
    !isDashboardRoute()
  )
    navigateTo('/404_PAGE', { state: { error: error } });
  if (
    error?.response?.config?.method === 'get' &&
    error?.response?.status === 403
  )
    navigateTo('/403_PAGE', { state: { error: error } });

  if (error?.response?.status === 401) {
    console.error(error);
    toast.error('Session Expired!');
    logout();
  }

  return Promise.reject(error);
});

function addProxyToken() {
  const proxyToken = getProxyToken();
  if (typeof window !== 'undefined') {
    const techdocToken = localStorage.getItem('techdoc_auth');
    if (techdocToken) {
      instance.defaults.headers.common.techdoc_auth = techdocToken;
      instance.defaults.headers.common.proxy_auth_token = proxyToken;
      return instance;
    }
  }
  if (proxyToken) {
    instance.defaults.headers.common.proxy_auth_token = proxyToken;
  }
  return instance;
}

async function getMethod(url, config = null) {
  instance = addProxyToken();
  if (url.includes('undefined')) {
    return;
  }
  return await instance.get(url, config);
}
async function postMethod(url, data = null, config = null) {
  instance = addProxyToken();
  return await instance.post(url, data, config);
}

async function putMethod(url, data = null, config = null) {
  instance = addProxyToken();
  return await instance.put(url, data, config);
}

async function deleteMethod(url, config = null) {
  instance = addProxyToken();
  return await instance.delete(url, config);
}

async function requestMethod() {
  instance = addProxyToken();
  return instance?.request;
}

async function patchMethod(url, data = null, config = null) {
  instance = addProxyToken();
  return instance.patch(url, data, config);
}

export default {
  get: getMethod,
  post: postMethod,
  put: putMethod,
  delete: deleteMethod,
  request: requestMethod(),
  patch: patchMethod,
};
