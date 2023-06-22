import uniqueId from 'lodash.uniqueid';

export default () => ({
  rss: [],
  posts: [],
  rssFormState: '',
  watchedPost: null,
  uiState: {
    readPosts: [],
  },
});

export const saveRss = (rssList, rssFeed, link) => {
  const newRssItem = {
    id: uniqueId(),
    ...rssFeed,
    link,
  };

  rssList.push(newRssItem);

  return newRssItem;
};

export const savePosts = (postsList, posts, rssId) => {
  const postsByRss = postsList.filter((post) => post.rssId === rssId);
  let postsToAdd = posts;
  if (postsByRss.length !== 0) {
    postsToAdd = posts.filter((post) => !postsByRss.some((elem) => elem.title === post.title));
  }
  const postsToState = postsToAdd.map((post) => ({
    id: uniqueId(),
    ...post,
    rssId,
  }));

  postsList.push(...postsToState);
};
