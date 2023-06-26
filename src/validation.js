import { string } from 'yup';
import { RSS_FORM_STATE } from './const';

export default (rssLink, rss) => {
  const rssSchema = string()
    .trim()
    .required()
    .url()
    .test((rssURL) => {
      if (!rss.map(({ link }) => link).includes(rssURL)) {
        return true;
      }

      throw new Error(RSS_FORM_STATE.URL_ALREADY_EXISTS);
    });

  return rssSchema.isValid(rssLink);
};
