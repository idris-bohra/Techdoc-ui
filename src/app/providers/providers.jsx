'use client';
import React, { useEffect } from 'react';
import { persistor, store } from '@/store/store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import IconButton from '@/components/common/iconButton';
import { MdClose } from 'react-icons/md';
import { getOrgId, SESSION_STORAGE_KEY } from '@/components/common/utility';
import { initConn, resetConn } from '@/services/webSocket/webSocketService';
import shortid from 'shortid';

const queryClient = new QueryClient();

export default function Providers({ children }) {
  useEffect(() => {
    const currentOrgId = getOrgId() ?? window.location.pathname.split('/')?.[2];
    if (currentOrgId) {
      initConn(currentOrgId);
    }
    sessionStorage.setItem(
      SESSION_STORAGE_KEY.UNIQUE_TAB_ID,
      shortid.generate()
    );

    return () => {
      resetConn();
    };
  }, []);

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.js').catch((err) =>
      console.error('Error loading bootstrap.js:', err)
    );
  }, []);
  return (
    <Provider store={store}>
      <ToastContainer
        position='bottom-left'
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme='dark'
        transition={Slide}
        toastClassName='custom-class'
        closeButton={
          <IconButton variant='sm'>
            <MdClose size={18} />
          </IconButton>
        }
      />
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
