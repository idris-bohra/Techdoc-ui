import PublicEndpoint from '@/components/publicEndpoint/publicEndpoint';
import axios from 'axios';
import Providers from '@/app/providers/providers';
import PublicPage from '@/appPages/publicPage/publicPage';
import HoverBox from '@/components/pages/hoverBox/hoverBox';
import ReduxProvider from '@/app/providers/reduxProvider';
import Page404 from '@/appPages/page404/page404';
import PropTypes from 'prop-types';
import './page.scss';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function getQueryParamsString({ params, searchParams, customDomain }) {
  const { slug } = params;
  const queryParamApi = {
    collectionId: searchParams?.collectionId || '',
    path: slug ? slug.join('/') : '',
    versionName: searchParams.version || '',
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

async function Page({ params, searchParams, customDomain }) {
  const queryParamsString = getQueryParamsString({
    params,
    searchParams,
    customDomain,
  });
  const data = await fetchData(
    `${apiUrl}/p/getPublishedDataByPath?${queryParamsString}`
  );
  const sidebarData = await fetchData(
    `${apiUrl}/p/getSideBarData?${queryParamsString}`
  );

  if (data.error || sidebarData.error) {
    return <Page404 />;
  }

  const collectionData = sidebarData?.collections[Object.keys(sidebarData?.collections)[0]] || {};
  const { favicon, docProperties } = collectionData;
  const docFaviconLink = favicon ? `data:image/png;base64,${favicon}` : docProperties?.defaultLogoUrl;
  const { widget_token } = docProperties || {};
  return (
    <ReduxProvider>
      <head>
        <link id='favicon' rel='icon' href={docFaviconLink || '/favicon.svg'} />
        <title>{data?.publishedContent?.name}</title>
        <meta
          property='og:title'
          content={data?.publishedContent?.name}
          key='og-title'
        />
        <meta
          name='description'
          content={data?.publishedContent?.meta?.description}
        />
        <meta
          property='og:description'
          content={data?.publishedContent?.meta?.description}
        />
        {data?.publishedContent?.meta?.tags?.length > 0 && (
          <meta
            name='keywords'
            content={data?.publishedContent?.meta?.tags.join(',')}
          />
        )}
      </head>
      <div className='d-flex w-100 position-relative'>
        <div className='d-flex justify-content-center mx-auto px-2 w-100'>
          {(data?.publishedContent?.type === 4 || data?.publishedContent?.type === 5) && <Providers>
            <PublicEndpoint widget_token={widget_token} pageContentDataSSR={data?.publishedContent || ''} />
          </Providers>}
          {(data?.publishedContent?.type === 1 ||
            data?.publishedContent?.type === 3) && (
              <div className='hm-right-content w-100 main-public-container'>
                <PublicPage
                  pageContentDataSSR={data?.publishedContent || ''}
                  pages={sidebarData?.pages || {}}
                  widget_token={widget_token}
                />
              </div>
            )}
        </div>
      </div>
      {(data?.publishedContent?.type === 1 ||
        data?.publishedContent?.type === 3) && (
          <div className='hover-box-container'>
            <HoverBox html={data?.publishedContent?.contents} />
          </div>
        )}
    </ReduxProvider>
  );
}

Page.propTypes = {
  params: PropTypes.object.isRequired,
  searchParams: PropTypes.object.isRequired,
  customDomain: PropTypes.string.isRequired,
};

export default Page;