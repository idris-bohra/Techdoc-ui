import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useExposeReduxState = () => {
  const reduxState = useSelector((state) => state); // Access Redux state

  useEffect(() => {
    // Attach the logs function to the global window object
    window.logs = () => {
      console.info('Redux State:', reduxState);
    };
    return () => {
      delete window.logs;
    };
  }, [reduxState]);
};

export default useExposeReduxState;
