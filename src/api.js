import axios from 'axios';
import { APP_ERRORS, PROXY_URL, REQUEST_TIMEOUT } from './const';

const getProxyUrl = (path) => {
  const url = new URL(PROXY_URL);

  url.searchParams.append('url', path);
  url.searchParams.append('disableCache', 'true');

  return url.toString();
};

const loadRssResource = (path) => axios.get(getProxyUrl(path), {
  timeout: REQUEST_TIMEOUT,
})
  .catch(() => { throw new Error(APP_ERRORS.NETWORK_ERR); })
  .then(({ data }) => data.contents);

export default loadRssResource;
