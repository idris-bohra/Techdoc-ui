import sidebarActionTypes from './sidebarActionTypes';

const initialState = {
  isSidebarOpen: false,
};

function sidebarReducer(state = initialState, action) {
  switch (action.type) {
    case sidebarActionTypes.SIDEBAR_OPEN_STATE:
      return { ...state, isSidebarOpen: action.payload };
    default:
      return state;
  }
}

export default sidebarReducer;
