import React from 'react';

const Loader = ({ size = '50px', color = '#3498db', style }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: size,
        width: size,
        ...style,
      }}
      className='btn btn-light border-0 p-0'
    >
      <div
        style={{
          border: `4px solid ${color}33`, // Lighter color for the border
          borderTop: `4px solid ${color}`, // Stronger color for the top
          borderRadius: '50%',
          width: size,
          height: size,
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
