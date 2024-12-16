import http from '@/services/httpService';
import { getOrgId } from '../common/utility';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(orgId = '') {
  const gotOrgId = orgId || getOrgId();
  return process.env.NEXT_PUBLIC_API_URL + `/orgs/${gotOrgId}`;
}

function collectionPagesUrl(pageId, orgId) {
  const apiUrl = getApiUrl(orgId);
  return `${apiUrl}/pages/${pageId}`;
}

function getAllPagesUrl(id) {
  return `${apiBaseUrl}/orgs/${id}/pages`;
}
export function getAllPages(id) {
  return http.get(getAllPagesUrl(id));
}

export function saveCollectionPage(rootParentId, page, orgId) {
  return http.post(collectionPagesUrl(rootParentId, orgId), page);
}

export function updatePage(pageId, page) {
  if (page.urlName === 'Untitled') {
    page.urlName = page.name;
  }
  const apiUrl = getApiUrl();
  return http.put(`${apiUrl}/pages/${pageId}`, page);
}

export function deletePage(pageId, page) {
  const apiUrl = getApiUrl();
  return http.delete(`${apiUrl}/pages/${pageId}`, { data: page });
}

export function duplicatePage(pageId) {
  const apiUrl = getApiUrl();
  return http.post(`${apiUrl}/duplicatePages/${pageId}`);
}

export function updatePageOrder(pagesOrder) {
  const apiUrl = getApiUrl();
  return http.patch(`${apiUrl}/updatePagesOrder`, {
    pagesOrder: pagesOrder,
  });
}

export function dragAndDropApi(body) {
  const apiUrl = getApiUrl();
  return http.post(`${apiUrl}/dragAndDrop`, body);
}

export function uploadFiles(formData) {
  const apiUrl = getApiUrl();
  return http.post(`${apiUrl}/upload/file`, formData);
}

export function globalSearch(
  searchTerm,
  isPublished,
  collectionId,
  customDomain
) {
  const apiUrl = getApiUrl();
  if (isPublished) {
    return http.post(`${process.env.NEXT_PUBLIC_API_URL}/p/global-search`, {
      searchTerm,
      isPublished,
      collectionId,
      customDomain,
    });
  }
  return http.post(`${apiUrl}/global-search`, {
    searchTerm,
    isPublished,
    collectionId,
    customDomain,
  });
}

export function publicSearch(searchTerm, collectionId, customDomain) {
  return http.post(`${apiBaseUrl}/p/global-search`, {
    searchTerm,
    collectionId,
    customDomain,
  });
}

export default {
  updatePage,
  deletePage,
  uploadFiles,
  duplicatePage,
  getAllPages,
  updatePageOrder,
  saveCollectionPage,
  dragAndDropApi,
  publicSearch,
};
