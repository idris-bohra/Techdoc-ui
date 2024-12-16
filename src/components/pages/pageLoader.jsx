import React from 'react';

const PageLoader = () => (
  <div className='loading'>
    <div className='box bg'></div>
    <div className='d-flex align-items-center justify-content-between mt-3'>
      <div>
        <div className='new bg rounded-1'></div>
        <div className='live bg mt-1'></div>
      </div>
      <div className='new bg rounded-1'></div>
    </div>
    <div className='d-flex align-items-center gap-3 mt-2'>
      <div className='api-call bg rounded-1'></div>
      <div className='bg send rounded-1'></div>
    </div>
    <div className='boxes mt-4 bg rounded-1'></div>
    <div className='bulk-edit bg mt-2 rounded-1'></div>
    <div className='path-var mt-2 bg rounded-1'></div>
    <div className='bulk-edit bg mt-2 rounded-1'></div>
    <div className='d-flex align-items-center justify-content-between mt-4'>
      <div className='response bg rounded-1'></div>
      <div className='d-flex align-items-center gap-2'>
        <div className='min-box bg rounded-1'></div>
        <div className='min-box bg rounded-1'></div>
      </div>
    </div>
    <div className='hit-send bg mt-3 rounded-1'></div>
  </div>
);

export default PageLoader;
