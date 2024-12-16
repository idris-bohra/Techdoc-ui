'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../auth/authServiceV2';
import Link from 'next/link';

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchedUser = getCurrentUser();
    if (fetchedUser) {
      fetchedUser.name = `${fetchedUser.first_name}${fetchedUser.last_name}`;
      setUser(fetchedUser);
    }
  }, []);

  return (
    <div className='btn-grp' id='user-menu'>
      <div className='dropdown user-dropdown'>
        <button
          className='user-dropdown-btn'
          type='button'
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <div className='user-info'>
            <div className='user-avatar'>
              <i className='uil uil-user' />
            </div>
            <div className='user-details'>
              <div className='user-details-heading'>
                <div className='user-name'>{user?.name}</div>
              </div>
            </div>
          </div>
        </button>
        <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
          <div className='user-info'>
            <div className='user-avatar'>
              <i className='uil uil-user' />
            </div>
            <div className='user-details'>
              <div className='user-details-heading'>
                <div className='user-name'>{user?.name}</div>
              </div>
              <div className='user-details-text'>{user?.email}</div>
            </div>
          </div>
          <li>
            <Link href='/logout'>Sign out</Link>
          </li>
          {user ? (
            <li>
              <Link href='/dashboard'>My Collections</Link>
            </li>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
