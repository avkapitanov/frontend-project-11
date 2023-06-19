import { string } from 'yup';

export default (rssLink, state) => {
  const rssSchema = string()
    .trim()
    .required()
    .url()
    .test((rssURL) => {
      const { rss } = state;
      return !rss.includes(rssURL);
    });

  return rssSchema.isValid(rssLink);
};
