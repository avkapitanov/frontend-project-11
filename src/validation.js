import { string } from 'yup';
import { APP_ERRORS } from './const';

export default (rssLink, rss) => {
  const rssSchema = string()
    .trim()
    .required()
    .url()
    .test((rssURL) => {
      if (!rss.map(({ link }) => link).includes(rssURL)) {
        return true;
      }

      throw new Error(APP_ERRORS.URL_ALREADY_EXISTS);
    });

  return rssSchema.isValid(rssLink);
};
