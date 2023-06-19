import { string } from 'yup';

export default (rssLink, state) => {
  const rssSchema = string()
    .trim()
    .required()
    .url()
    .test((rssURL) => {
      const { rss } = state;

      if (!rss.includes(rssURL)) {
        return true;
      }

      throw new Error('alreadyExists');
    });

  return rssSchema.isValid(rssLink);
};
