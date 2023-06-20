import axios from 'axios';
import { PROXI_URL, REQUEST_TIMEOUT } from './const';

const getProxiedUrl = (path) => {
  const url = new URL(PROXI_URL);

  url.searchParams.append('url', path);
  url.searchParams.append('disableCache', 'true');

  return url.toString();
};

const loadRssResource = (path) => axios.get(getProxiedUrl(path), {
  timeout: REQUEST_TIMEOUT,
})
  .catch(() => { throw new Error('rssLoadMessages.networkError'); })
  .then(({ data }) => data.contents);

export default loadRssResource;
