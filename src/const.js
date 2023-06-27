export const PROXY_URL = 'https://allorigins.hexlet.app/get';
export const REQUEST_TIMEOUT = 5000;
export const CHECK_RSS_RESOURCES_TIME = 5000;
export const DEFAULT_APP_LANGUAGE = 'ru';

export const RSS_FORM_STATE = {
  FILLING: 'filling',
  INVALID: 'invalid',
  IN_PROGRESS: 'inProgress',
  SENT: 'sent',
};

export const APP_ERRORS = {
  INVALID_RSS: 'invalidRss',
  INVALID_URL: 'invalidUrl',
  URL_ALREADY_EXISTS: 'alreadyExists',
  EMPTY_URL: 'emptyUrl',
  NETWORK_ERR: 'networkError',
};

export const LOADING_PROCESS_STATE = {
  IDLE: 'idle',
  FAILED: 'failed',
  SUCCEEDED: 'succeeded',
};
