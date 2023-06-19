import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import validationRss from './validationRss';

const renderRssFormStatus = (text, type) => {
  const feedback = document.querySelector('.feedback');
  const removeCls = type === 'success' ? 'danger' : 'success';
  feedback.innerHTML = text;

  feedback.classList.add(`text-${type}`);
  feedback.classList.remove(`text-${removeCls}`);
};

const renderFeedsList = ({ rss }) => {
  const rssListWrapper = document.querySelector('.rss-list-wrapper');

  if (rss.length > 0) {
    const rssList = document.querySelector('.rss-list');
    rssList.innerHTML = '';
    rssListWrapper.classList.remove('d-none');
    const list = document.createElement('ul');
    list.classList.add('list-group', 'border-0', 'rounded-0');
    rss.forEach((rssItem) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'border-0', 'border-end-0');
      const rssTitle = document.createElement('h3');
      rssTitle.classList.add('h6', 'm-0');
      rssTitle.textContent = rssItem;
      listItem.append(rssTitle);
      list.append(listItem);
    });
    rssList.append(list);
    return;
  }
  rssListWrapper.classList.add('d-none');
};

const runApp = (initialState) => {
  const defaultLanguage = 'ru';
  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const state = { ...initialState };
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rss':
        renderFeedsList(watchedState);
        break;
      case 'rssFormStatus': {
        const type = value === 'loaded' ? 'success' : 'danger';
        renderRssFormStatus(i18n.t(`rssFormStatuses.${value}`), type);
        break;
      }
      default:
        break;
    }
  });
  const rssAddForm = document.querySelector('.rss-form');
  const rssFormInput = document.querySelector('#url-input');

  rssAddForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const rssUrl = new FormData(rssAddForm).get('url');
    validationRss(rssUrl, watchedState)
      .then((isValid) => {
        if (isValid) {
          rssFormInput.classList.remove('is-invalid');
          watchedState.rss = [...watchedState.rss, rssUrl];
          watchedState.rssFormStatus = 'loaded';
          rssAddForm.reset();
          rssFormInput.focus();
        } else {
          watchedState.rssFormStatus = 'invalidUrl';
          rssFormInput.classList.add('is-invalid');
        }
      })
      .catch((error) => {
        watchedState.rssFormStatus = error.message;
      });
  });
};

export default runApp;
