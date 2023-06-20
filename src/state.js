import uniqueId from 'lodash.uniqueid';

export default () => ({
  rss: [],
  posts: [],
  rssFormStatus: '',
});

export const saveRss = (rsslist, rssFeed, link) => {
  const newRssItem = {
    id: uniqueId(),
    ...rssFeed,
    link,
  };

  return {
    rssList: [newRssItem, ...rsslist],
    newRssItem,
  };
};

export const savePosts = (postsList, posts, rssId) => {
  const postsToAdd = posts.map((post) => ({
    id: uniqueId(),
    ...post,
    rssId,
  }));

  return [...postsToAdd, ...postsList];
};
