import uniqueId from 'lodash.uniqueid';
import { LOADING_PROCESS_STATE, RSS_FORM_STATE } from './const';

export default () => ({
  rss: [],
  posts: [],
  watchedPost: null,
  uiState: {
    readPosts: [],
  },
  loadingProcess: {
    status: LOADING_PROCESS_STATE.SUCCEEDED,
    error: null,
  },
  form: {
    status: RSS_FORM_STATE.FILLING,
    error: null,
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
