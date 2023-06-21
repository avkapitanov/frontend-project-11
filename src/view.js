import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import validationRss from './validationRss';
import loadRssResource from './api';
import parseData from './parser';
import { savePosts, saveRss } from './state';
import { renderFeedsList, renderPosts, renderRssFormStatusMessage } from './render';
import { CHECK_RSS_RESOURCES_TIME } from './const';

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
  const defaultLanguage = 'ru';
  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const elements = {
    rssAddForm: document.querySelector('.rss-form'),
    rssFormInput: document.querySelector('#url-input'),
    detailPostModal: document.querySelector('#post-detail-modal'),
  };

  const state = { ...initialState };
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rss':
        renderFeedsList(watchedState);
        break;
      case 'posts':
        renderPosts(watchedState, i18n);
        break;
      case 'rssFormStatus': {
        const type = value === 'loaded' ? 'success' : 'danger';
        renderRssFormStatusMessage(i18n.t(`rssFormStatuses.${value}`), type);
        if (value === 'loaded') {
          elements.rssFormInput.classList.remove('is-invalid');
          elements.rssAddForm.reset();
          elements.rssFormInput.focus();
        }
        if (value === 'error') {
          elements.rssFormInput.classList.add('is-invalid');
        }
        break;
      }
      case 'watchedPost':
        if (value !== null) {
          const { title, description, link } = value;

          const modalTitle = elements.detailPostModal.querySelector('.modal-title');
          modalTitle.textContent = title;

          const modalDescription = elements.detailPostModal.querySelector('.modal-body');
          modalDescription.textContent = description;

          const modalDetailLink = elements.detailPostModal.querySelector('.btn-detail-link');
          modalDetailLink.setAttribute('href', link);

          watchedState.watchedPost = null;
        }
        break;
      case 'uiState.readPosts': {
        const postId = watchedState.uiState.readPosts.at(-1);
        const postLink = document.querySelector(`[data-post-id="${postId}"]`);
        postLink.classList.remove('fw-bold');
        postLink.classList.add('fw-normal', 'link-secondary');
        break;
      }
      default:
        break;
    }
  });

  elements.rssAddForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const rssUrl = new FormData(elements.rssAddForm).get('url');
    validationRss(rssUrl, watchedState)
      .then((isValid) => {
        if (!isValid) {
          throw new Error('rssLoadMessages.invalidRSS');
        }
        return loadRssResource(rssUrl);
      })
      .then((data) => {
        const { posts, rssFeed } = parseData(data);
        const newRssItem = saveRss(watchedState.rss, rssFeed, rssUrl);
        const { id: rssId } = newRssItem;
        savePosts(watchedState.posts, posts, rssId);
        watchedState.rssFormStatus = 'loaded';
      })
      .catch((error) => {
        watchedState.rssFormStatus = error.message;
        watchedState.rssFormStatus = 'invalidUrl';
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
};

export default runApp;
