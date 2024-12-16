import React from 'react';
import { headers } from 'next/headers';
import Page404 from '@/appPages/page404/page404';
import ReduxProvider from './providers/reduxProvider';
import PublicHeader from '@/components/publicHeader/publicHeader';
import SmallScreenPublicSidebar from '@/components/publicSidebar/smallScreenPublicSidebar/smallScreenPublicSidebar';
import PublicSidebar from '@/components/publicSidebar/publicSidebar';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import '../index.scss';
import '../components/auth/auth.scss';
import './(other)/login/login.scss';
import './(other)/onBoarding/onBoarding.scss';
import './(other)/orgs/[orgId]/trash/trash.scss';
import './(other)/orgs/[orgId]/invite/inviteTeam.scss';
import './(other)/orgs/[orgId]/collection/[collectionId]/redirections/redirections.scss';
import './(other)/orgs/[orgId]/collection/[collectionId]/runner/runAutomation.scss';
import '../components/main/responsive.scss';
import '../components/publicEndpoint/publicEndpoint.scss';
import '../components/main/main.scss';
import '../components/indexWebsite/indexWebsite.scss';
import '../components/tabs/tabs.scss';
import '../app/p/[...slug]/page.scss';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function getQueryParamsString({ pathname, customDomain }) {
  const queryParamApi = {
    path: pathname || '',
    custom_domain: customDomain || '',
  };

  return Object.entries(queryParamApi)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Data not found');
      return { error: true };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: true };
  }
}

async function RenderPublicComponentWithChild({ pathname, searchParams, customDomain, children }) {
  let queryParamsString = getQueryParamsString({ pathname, customDomain });
  queryParamsString += '&' + searchParams;
  const sidebarData = await fetchData(`${apiUrl}/p/getSideBarData?${queryParamsString}`);
  if (sidebarData.error) return <Page404 />;
  const collectionData = sidebarData?.collections[Object.keys(sidebarData?.collections)[0]] || {};
  const { docProperties } = collectionData;
  const { defaultHeader: headerData, defaultFooter: footerData, } = docProperties || {};
  return (
    <ReduxProvider>
      <div className='w-100vw hm-main-wrapper'>
        {headerData && <PublicHeader headerData={headerData} />}
        <SmallScreenPublicSidebar sidebarData={sidebarData} customDomain={customDomain} />
        <div className={`d-flex m-auto min-vh-100 max-width-container responsive-padding ${headerData ? 'px-2 py-4' : 'px-2 py-5'}`}>
          <div className='screen-public-sidebar-container'>
            <PublicSidebar customDomain={customDomain} sidebarData={sidebarData} />
          </div>
          {children}
        </div>
        {footerData && (
          <div className='public-footer'>
            <div className='footer-ruler' />
            <div className='preview-content mx-auto' dangerouslySetInnerHTML={{ __html: footerData }} />
          </div>
        )}
      </div>
    </ReduxProvider>
  );
}

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const url = new URL(requestHeaders.get('x-full-url'));
  let host = requestHeaders.get('host');
  const pathname = url.pathname;
  const queryParams = url.searchParams.toString();
  let isPublic = false;
  let isWithDomain = false;
  if (host.includes('127.0.0.1')) host = '127.0.0.1';
  if (process.env.NEXT_PUBLIC_UI_URLS.includes(host)) isPublic = (pathname.startsWith('/p') && !pathname.startsWith('/proxy')) ? true : false
  else {
    isPublic = true;
    isWithDomain = true;
  }
  return (
    <html lang='en'>
      <head>
        <link
          rel='stylesheet'
          href='https://unicons.iconscout.com/release/v2.1.9/css/unicons.css'
        />
        {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" /> */}
        <link
          rel='preload'
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap'
          as='style'
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap'
          />
        </noscript>
        <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'></script>
        <script src='https://code.jquery.com/jquery-3.1.1.min.js'></script>
        <script src='https://unpkg.com/react-jsonschema-form/dist/react-jsonschema-form.js'></script>
        <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js'></script>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js'></script>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-searchbox.js'></script>
      </head>
      <body>
        <div id='root'>
          {isPublic ? <RenderPublicComponentWithChild pathname={pathname} customDomain={isWithDomain ? host : ''} searchParams={queryParams} children={children} /> : children}
        </div>
      </body>
    </html>
  );
}
