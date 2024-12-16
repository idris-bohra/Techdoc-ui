import sidebarActionTypes from './sidebarActionTypes';

export const sidebarOpenStatus = (payload) => {
  return {
    type: sidebarActionTypes.SIDEBAR_OPEN_STATE,
    payload,
  };
};
