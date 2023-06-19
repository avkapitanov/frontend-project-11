import onChange from 'on-change';
import validationRss from './validationRss';

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
  const state = { ...initialState };
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'rss':
        renderFeedsList(watchedState);
        break;
      default:
        break;
    }
  });
  const rssAddForm = document.querySelector('.rss-form');
  const rssFormInput = document.querySelector('#url-input');

  rssAddForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const rssUrl = new FormData(rssAddForm).get('url');
    validationRss(rssUrl, watchedState).then((isValid) => {
      if (isValid) {
        rssFormInput.classList.remove('is-invalid');
        watchedState.rss = [...watchedState.rss, rssUrl];
        rssAddForm.reset();
        rssFormInput.focus();
      } else {
        rssFormInput.classList.add('is-invalid');
      }
    });
  });
};

export default runApp;
