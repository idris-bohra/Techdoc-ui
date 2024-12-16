import React from 'react';
import { getCurrentUser } from '../auth/authServiceV2';
const EndpointEntityTabs = ({
  activeTab,
  checkProtocolType,
  setState,
  tabId,
}) => {
  return (
    <div className='d-flex justify-content-between align-items-center'>
      <div className='headers-params-wrapper custom-tabs w-100'>
        <ul
          className='nav nav-tabs border-0 border-bottom w-100 rounded-0 mb-2'
          id='pills-tab'
          role='tablist'
        >
          {checkProtocolType(1) && (
            <>
              <li className='nav-item'>
                <a
                  className={`nav-link bg-none ${activeTab === 'default' ? 'active text-black' : 'text-secondary'}`}
                  id={`pills-params-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#params-${tabId}`}
                  role='tab'
                  aria-controls={`params-${tabId}`}
                  aria-selected={activeTab === 'default'}
                  onClick={() => setState({ activeTab: 'default' })}
                >
                  Params
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link bg-none ${activeTab === 'authorization' ? 'active text-black' : 'text-secondary'}`}
                  id={`pills-authorization-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#authorization-${tabId}`}
                  role='tab'
                  aria-controls={`authorization-${tabId}`}
                  aria-selected={activeTab === 'authorization'}
                  onClick={() => setState({ activeTab: 'authorization' })}
                >
                  Authorization
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link bg-none ${activeTab === 'headers' ? 'active text-black' : 'text-secondary'}`}
                  id={`pills-headers-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#headers-${tabId}`}
                  role='tab'
                  aria-controls={`headers-${tabId}`}
                  aria-selected={activeTab === 'headers'}
                  onClick={() => setState({ activeTab: 'headers' })}
                >
                  Headers
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link bg-none ${activeTab === 'body' ? 'active text-black' : 'text-secondary'}`}
                  id={`pills-body-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#body-${tabId}`}
                  role='tab'
                  aria-controls={`body-${tabId}`}
                  aria-selected={activeTab === 'body'}
                  onClick={() => setState({ activeTab: 'body' })}
                >
                  Body
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link bg-none ${activeTab === 'script' ? 'active text-black' : 'text-secondary'}`}
                  id={`pills-script-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#script-${tabId}`}
                  role='tab'
                  aria-controls={`script-${tabId}`}
                  aria-selected={activeTab === 'script'}
                  onClick={() => setState({ activeTab: 'script' })}
                >
                  Script
                </a>
              </li>
              {getCurrentUser() && (
                <li className='nav-item cookie-tab'>
                  <a
                    className={`nav-link bg-none ${activeTab === 'cookies' ? 'active text-black' : 'text-secondary'}`}
                    onClick={() => setState({ showCookiesModal: true })}
                  >
                    Cookies
                  </a>
                </li>
              )}
            </>
          )}
          {checkProtocolType(2) && (
            <>
              {/* Protocol Type 2 Tabs */}
              <li className='nav-item'>
                <a
                  className={`nav-link ${activeTab === 'default' ? 'active text-back' : 'text-gray'}`}
                  id={`pills-query-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#query-${tabId}`}
                  role='tab'
                  aria-controls={`query-${tabId}`}
                  aria-selected={activeTab === 'default'}
                  onClick={() => setState({ activeTab: 'default' })}
                >
                  Query
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link ${activeTab === 'authorization' ? 'active text-black' : 'text-gray'}`}
                  id={`pills-authorization-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#authorization-${tabId}`}
                  role='tab'
                  aria-controls={`authorization-${tabId}`}
                  aria-selected={activeTab === 'authorization'}
                  onClick={() => setState({ activeTab: 'authorization' })}
                >
                  Authorization
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link ${activeTab === 'headers' ? 'active text-black' : 'text-gray'}`}
                  id={`pills-headers-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#headers-${tabId}`}
                  role='tab'
                  aria-controls={`headers-${tabId}`}
                  aria-selected={activeTab === 'headers'}
                  onClick={() => setState({ activeTab: 'headers' })}
                >
                  Headers
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link ${activeTab === 'g-script' ? 'active text-black' : 'text-gray'}`}
                  id={`pillss-script-tab-${tabId}`}
                  data-toggle='pill'
                  href={`#g-script-${tabId}`}
                  role='tab'
                  aria-controls={`g-script-${tabId}`}
                  aria-selected={activeTab === 'g-script'}
                  onClick={() => setState({ activeTab: 'g-script' })}
                >
                  Script
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
export default EndpointEntityTabs;
