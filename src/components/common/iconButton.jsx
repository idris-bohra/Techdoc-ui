import React from 'react';
import './iconButton.scss';

export default function IconButton(props) {
  return (
    <div
      onClick={props?.onClick}
      className={
        (props?.variant === 'sm'
          ? 'icon-button-sm cursor-pointer'
          : 'icon-button cursor-pointer') +
        ' ' +
        'd-flex justify-content-center align-items-center' +
        ' ' +
        props?.className
      }
    >
      {props.children}
    </div>
  );
}
