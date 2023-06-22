import onChange from 'on-change';
import i18next from 'i18next';
import { setLocale } from 'yup';
import resources from './locales/index.js';
import validateRss from './validationRss';
import loadRssResource from './api';
import parseData from './parser';
import { savePosts, saveRss } from './state';
import { CHECK_RSS_RESOURCES_TIME, DEFAULT_APP_LANGUAGE, RSS_FORM_STATE } from './const';
import render from './view';

const checkRssResources = (state) => {
  setTimeout(() => {
    Promise.all(state.rss.map(({ link }) => loadRssResource(link)))
      .then((data) => {
        data.forEach((rssData, ind) => {
          const { posts } = parseData(rssData);
          const { id: rssId } = state.rss[ind];

          savePosts(state.posts, posts, rssId);
        });
        checkRssResources(state);
      });
  }, CHECK_RSS_RESOURCES_TIME);
};

const runApp = (initialState) => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: DEFAULT_APP_LANGUAGE,
    debug: false,
    resources,
  }).then(() => {
    setLocale({
      string: {
        url: RSS_FORM_STATE.INVALID_URL,
        required: RSS_FORM_STATE.EMPTY_URL,
      },
    });
    const elements = {
      rssAddForm: document.querySelector('.rss-form'),
      rssFormInput: document.querySelector('#url-input'),
      detailPostModal: document.querySelector('#post-detail-modal'),
      addBtn: document.querySelector('.rss-form__add-btn'),
      addBtnSpinner: document.querySelector('.rss-form__add-btn-spinner'),
      rssList: document.querySelector('.rss-list'),
      rssBlockTitle: document.querySelector('.rss-list-wrapper .card-title'),
      postList: document.querySelector('.posts-list'),
      postBlockTitle: document.querySelector('.posts-list-wrapper .card-title'),
      feedback: document.querySelector('.feedback'),
    };

    const state = { ...initialState };
    const watchedState = onChange(
      state,
      (path, value) => render(path, value, state, i18n, elements),
    );

    elements.rssAddForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const rssUrl = new FormData(elements.rssAddForm).get('url');
      validateRss(rssUrl, watchedState)
        .then((isValid) => {
          if (!isValid) {
            throw new Error(RSS_FORM_STATE.INVALID_URL);
          }
          watchedState.rssFormState = RSS_FORM_STATE.START;
          return loadRssResource(rssUrl);
        })
        .then((data) => {
          const { posts, rssFeed } = parseData(data);
          const newRssItem = saveRss(watchedState.rss, rssFeed, rssUrl);
          const { id: rssId } = newRssItem;
          savePosts(watchedState.posts, posts, rssId);
          watchedState.rssFormState = RSS_FORM_STATE.LOADED;
        })
        .catch((error) => {
          if (error.isAxiosError) {
            watchedState.rssFormState = RSS_FORM_STATE.NETWORK_ERR;
          } else {
            watchedState.rssFormState = error.message;
          }
        })
        .finally(() => {
          watchedState.rssFormState = RSS_FORM_STATE.WAIT;
        });

      checkRssResources(watchedState);
    });

    elements.detailPostModal.addEventListener('show.bs.modal', (evt) => {
      const btn = evt.relatedTarget;
      const { postId } = btn.dataset;
      watchedState.watchedPost = watchedState.posts.find(({ id }) => id === postId);
      if (!watchedState.uiState.readPosts.includes(postId)) {
        watchedState.uiState.readPosts.push(postId);
      }
    });

    elements.detailPostModal.addEventListener('shown.bs.modal', () => {
      watchedState.watchedPost = null;
    });
  });
};

export default runApp;