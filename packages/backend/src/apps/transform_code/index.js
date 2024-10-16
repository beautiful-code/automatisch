import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Transform Code',
  key: 'transform_code',
  iconUrl: '{BASE_URL}/apps/transform_code/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/transform_code/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#001F52',
  actions,
});
