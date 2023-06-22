import axios from 'axios';
import { PROXI_URL, REQUEST_TIMEOUT, RSS_FORM_STATE } from './const';

const getProxyUrl = (path) => {
  const url = new URL(PROXI_URL);

  url.searchParams.append('url', path);
  url.searchParams.append('disableCache', 'true');

  return url.toString();
};

const loadRssResource = (path) => axios.get(getProxyUrl(path), {
  timeout: REQUEST_TIMEOUT,
})
  .catch(() => { throw new Error(RSS_FORM_STATE.NETWORK_ERR); })
  .then(({ data }) => data.contents);

export default loadRssResource;
