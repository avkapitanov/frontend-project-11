import { RSS_FORM_STATE } from './const';

const renderFeedsList = (state, elements) => {
  const { rss } = state;
  const { rssList } = elements;
  if (rss.length === 0) {
    return;
  }

  rssList.innerHTML = '';
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  rss.forEach((rssItem) => {
    const { title, description } = rssItem;
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    const rssTitle = document.createElement('h3');
    rssTitle.classList.add('h6', 'm-0');
    rssTitle.textContent = title;
    listItem.append(rssTitle);

    const rssDescription = document.createElement('p');
    rssDescription.classList.add('m-0', 'small', 'text-black-50');
    rssDescription.textContent = description;
    listItem.append(rssDescription);

    list.append(listItem);
  });
  rssList.append(list);
};

const createPostLink = ({ id, title, link }, state) => {
  const postLink = document.createElement('a');
  const classesToPost = state.uiState.readPosts.includes(id) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];
  postLink.classList.add(...classesToPost);
  postLink.textContent = title;
  postLink.setAttribute('href', link);
  postLink.setAttribute('target', '_blank');
  postLink.setAttribute('data-post-id', id);
  return postLink;
};

const createPostDetailBtn = ({ id }, i18n) => {
  const postMoreBtn = document.createElement('button');
  postMoreBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  postMoreBtn.textContent = i18n.t('postsList.view');
  postMoreBtn.setAttribute('data-post-id', id);
  postMoreBtn.dataset.bsToggle = 'modal';
  postMoreBtn.dataset.bsTarget = '#post-detail-modal';
  return postMoreBtn;
};

const renderPosts = (state, elements, i18n) => {
  const { posts } = state;
  const { postList } = elements;

  if (posts.length === 0) {
    return;
  }

  postList.innerHTML = '';
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((post) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const postTitle = createPostLink(post, state);
    listItem.append(postTitle);

    const postMoreBtn = createPostDetailBtn(post, i18n);
    listItem.append(postMoreBtn);

    list.append(listItem);
  });
  postList.append(list);
};

const renderRssFormStatusMessage = (elements, text, type = 'success') => {
  const { feedback } = elements;
  const removeCls = type === 'success' ? 'danger' : 'success';
  feedback.innerHTML = text;

  feedback.classList.add(`text-${type}`);
  feedback.classList.remove(`text-${removeCls}`);
};

export const fillAppTexts = (elements, i18n) => {
  const {
    appTitle,
    appDescription,
    rssFormLabel,
    rssFormInput,
    viewFullModal,
    btnCloseModal,
    rssFormHelpText,
    addBtnText,
  } = elements;

  appTitle.textContent = i18n.t('mainUI.appTitle');
  appDescription.textContent = i18n.t('mainUI.appDescription');
  rssFormLabel.textContent = i18n.t('mainUI.rssFormLabel');
  rssFormInput.placeholder = i18n.t('mainUI.rssFormLabel');
  viewFullModal.textContent = i18n.t('mainUI.viewFullModal');
  btnCloseModal.textContent = i18n.t('mainUI.btnCloseModal');
  rssFormHelpText.textContent = i18n.t('mainUI.rssFormHelpText');
  addBtnText.textContent = i18n.t('mainUI.addBtnText');
};

const showModal = (value, elements) => {
  const { title, description, link } = value;
  const { detailPostModal } = elements;

  const modalTitle = detailPostModal.querySelector('.modal-title');
  modalTitle.textContent = title;

  const modalDescription = detailPostModal.querySelector('.modal-body');
  modalDescription.innerHTML = description;

  const modalDetailLink = detailPostModal.querySelector('.btn-detail-link');
  modalDetailLink.setAttribute('href', link);
};

const processRssFormState = (value, elements, i18n) => {
  switch (value) {
    case RSS_FORM_STATE.START:
      elements.addBtnSpinner.classList.remove('visually-hidden');
      elements.addBtn.setAttribute('disabled', 'disabled');
      renderRssFormStatusMessage(elements, '');
      break;
    case RSS_FORM_STATE.LOADED:
      elements.rssFormInput.classList.remove('is-invalid');
      elements.rssAddForm.reset();
      elements.rssFormInput.focus();
      elements.addBtnSpinner.classList.add('visually-hidden');
      renderRssFormStatusMessage(elements, i18n.t(`rssLoadMessages.${value}`), 'success');
      break;
    case RSS_FORM_STATE.INVALID_RSS:
    case RSS_FORM_STATE.INVALID_URL:
    case RSS_FORM_STATE.URL_ALREADY_EXISTS:
    case RSS_FORM_STATE.EMPTY_URL:
    case RSS_FORM_STATE.NETWORK_ERR:
      elements.rssFormInput.classList.add('is-invalid');
      elements.addBtnSpinner.classList.add('visually-hidden');
      renderRssFormStatusMessage(elements, i18n.t(`rssLoadMessages.${value}`), 'danger');
      break;
    case RSS_FORM_STATE.WAIT:
      elements.addBtnSpinner.classList.add('visually-hidden');
      elements.addBtn.removeAttribute('disabled');
      break;
    default:
      throw new Error(`Unknown form state: ${value}`);
  }
};

const processChangeLanguage = (value, elements, i18n) => {
  [...elements.languageBtn].forEach((btn) => {
    if (btn.dataset.lang === value) {
      btn.classList.replace('btn-outline-light', 'btn-primary');
    } else {
      btn.classList.replace('btn-primary', 'btn-outline-light');
    }
  });
  fillAppTexts(elements, i18n);
};

const render = (path, value, watchedState, i18n, elements) => {
  switch (path) {
    case 'rss': {
      const { rssBlockTitle } = elements;
      rssBlockTitle.textContent = i18n.t('rssList.blockTitle');
      renderFeedsList(watchedState, elements);
      break;
    }
    case 'posts': {
      const { postBlockTitle } = elements;
      postBlockTitle.textContent = i18n.t('postsList.blockTitle');
      renderPosts(watchedState, elements, i18n);
      break;
    }
    case 'rssFormState':
      processRssFormState(value, elements, i18n);
      break;
    case 'watchedPost':
      if (value !== null) {
        showModal(value, elements);
      }
      break;
    case 'uiState.readPosts': {
      const postId = watchedState.uiState.readPosts.at(-1);
      const postLink = document.querySelector(`[data-post-id="${postId}"]`);
      postLink.classList.remove('fw-bold');
      postLink.classList.add('fw-normal', 'link-secondary');
      break;
    }
    case 'currentLanguage':
      processChangeLanguage(value, elements, i18n);
      break;
    default:
      throw new Error(`Unknown app state: ${value}`);
  }
};

export default render;
