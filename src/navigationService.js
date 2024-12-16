let router;
let params = {};

export const setNavigate = (nav) => {
  router = nav;
};

export const navigateTo = (path, state) => {
  if (router) {
    router.push(path, { state });
  } else {
    console.error('Navigate function is not set');
  }
};

export const setParams = (p) => {
  params = p;
};

export const getParams = () => {
  return params;
};
