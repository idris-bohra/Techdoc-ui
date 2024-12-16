import { rawTypesEnums, bodyTypesEnums } from '../common/bodyTypeEnums';
import { getCurrentUserSSLMode } from '../auth/authServiceV2';

export const untitledEndpointData = {
  data: {
    name: 'Untitled',
    method: 'GET',
    body: {
      type: rawTypesEnums.JSON,
      [bodyTypesEnums['raw']]: { rawType: rawTypesEnums.JSON, value: '' },
      [bodyTypesEnums['application/x-www-form-urlencoded']]: [
        {
          checked: 'notApplicable',
          key: '',
          value: '',
          description: '',
          type: 'text',
        },
      ],
      [bodyTypesEnums['multipart/form-data']]: [
        {
          checked: 'notApplicable',
          key: '',
          value: '',
          description: '',
          type: 'text',
        },
      ],
    },
    uri: '',
    updatedUri: '',
    URL: '',
  },
  pathVariables: [],
  environment: {},
  endpoint: {},
  originalHeaders: [
    {
      checked: 'notApplicable',
      key: '',
      value: '',
      description: '',
      type: '',
    },
  ],
  originalParams: [
    {
      checked: 'notApplicable',
      key: '',
      value: '',
      description: '',
      type: '',
    },
  ],
  oldDescription: '',
  headers: [],
  publicBodyFlag: true,
  params: [],
  bodyDescription: {},
  fieldDescription: {},
  sampleResponseArray: [],
  theme: '',
  preScriptText: '',
  postScriptText: '',
  host: {},
  sslMode: getCurrentUserSSLMode,
  currentView: 'testing',
  docViewData: [
    { type: 'host' },
    { type: 'body' },
    { type: 'params' },
    { type: 'pathVariables' },
    { type: 'headers' },
    { type: 'sampleResponse' },
  ],
  harObject: {},
  authorizationData: {
    authorization: {},
    authorizationTypeSelected: '',
  },
  protocolType: 1,
};
