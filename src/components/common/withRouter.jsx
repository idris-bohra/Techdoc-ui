import React from 'react';
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const router = useRouter();
    const location = {
      pathname: usePathname(),
      query: useSearchParams(),
      navigate: (path, options) => router.push(path, undefined, options),
    };
    const params = useParams();

    return (
      <Component
        {...props}
        router={router}
        location={location}
        params={params}
      />
    );
  }

  return ComponentWithRouterProp;
}

export default withRouter;
