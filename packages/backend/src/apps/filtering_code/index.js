import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';


export default defineApp({
  name: 'Filtering Code',
  key: 'filtering_code',
  iconUrl: '{BASE_URL}/apps/filtering_code/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/filtering_code/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '#001F52',
  actions,
});
