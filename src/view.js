import { LOADING_PROCESS_STATE, RSS_FORM_STATE } from './const';

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

const renderStatusMessage = (elements, text, type = 'success') => {
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
    copyrightText,
    copyrightAuthor,
  } = elements;

  appTitle.textContent = i18n.t('mainUI.appTitle');
  appDescription.textContent = i18n.t('mainUI.appDescription');
  rssFormLabel.textContent = i18n.t('mainUI.rssFormLabel');
  rssFormInput.placeholder = i18n.t('mainUI.rssFormLabel');
  viewFullModal.textContent = i18n.t('mainUI.viewFullModal');
  btnCloseModal.textContent = i18n.t('mainUI.btnCloseModal');
  rssFormHelpText.textContent = i18n.t('mainUI.rssFormHelpText');
  addBtnText.textContent = i18n.t('mainUI.addBtnText');
  copyrightText.textContent = i18n.t('mainUI.createdBy');
  copyrightAuthor.textContent = i18n.t('mainUI.authorName');
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

const markReadPost = (postId) => {
  const postLink = document.querySelector(`[data-post-id="${postId}"]`);
  postLink.classList.remove('fw-bold');
  postLink.classList.add('fw-normal', 'link-secondary');
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

const renderRssBlock = (watchedState, elements, i18n) => {
  const { rssBlockTitle } = elements;
  rssBlockTitle.textContent = i18n.t('rssList.blockTitle');
  renderFeedsList(watchedState, elements);
};

const renderPostsBlock = (watchedState, elements, i18n) => {
  const { postBlockTitle } = elements;
  postBlockTitle.textContent = i18n.t('postsList.blockTitle');
  renderPosts(watchedState, elements, i18n);
};

const setInProgressFormStatus = (elements) => {
  const { addBtnSpinner, addBtn } = elements;
  addBtnSpinner.classList.remove('visually-hidden');
  addBtn.setAttribute('disabled', 'disabled');
  renderStatusMessage(elements, '');
};

const setInvalidFormStatus = (elements, error, i18n) => {
  const { rssFormInput, addBtnSpinner } = elements;
  rssFormInput.classList.add('is-invalid');
  addBtnSpinner.classList.add('visually-hidden');
  if (error !== null) {
    renderStatusMessage(elements, i18n.t(`rssLoadMessages.${error}`), 'danger');
  }
};

const setSentFormStatus = (elements) => {
  const {
    addBtnSpinner, addBtn, rssFormInput, rssAddForm,
  } = elements;
  addBtnSpinner.classList.add('visually-hidden');
  addBtn.removeAttribute('disabled');
  rssFormInput.classList.remove('is-invalid');
  rssAddForm.reset();
  rssFormInput.focus();
};

const setFillingFormStatus = (elements) => {
  const { addBtnSpinner, addBtn } = elements;
  addBtnSpinner.classList.add('visually-hidden');
  addBtn.removeAttribute('disabled');
};

const processRssFormStatus = (value, error, elements, i18n) => {
  switch (value) {
    case RSS_FORM_STATE.IN_PROGRESS:
      setInProgressFormStatus(elements);
      break;
    case RSS_FORM_STATE.INVALID:
      setInvalidFormStatus(elements, error, i18n);
      break;
    case RSS_FORM_STATE.SENT:
      setSentFormStatus(elements);
      break;
    case RSS_FORM_STATE.FILLING:
      setFillingFormStatus(elements);
      break;
    default:
      throw new Error(`Unknown form status: ${value}`);
  }
};

const handleLoadingProcess = (value, error, elements, i18n) => {
  switch (value) {
    case LOADING_PROCESS_STATE.SUCCEEDED:
      renderStatusMessage(elements, i18n.t('rssLoadMessages.loaded'));
      break;
    case LOADING_PROCESS_STATE.FAILED:
      if (error !== null) {
        renderStatusMessage(elements, i18n.t(`rssLoadMessages.${error}`), 'danger');
      }
      break;
    default:
      throw new Error(`Unknown form status: ${value}`);
  }
};

const render = (path, value, watchedState, i18n, elements) => {
  switch (path) {
    case 'rss':
      renderRssBlock(watchedState, elements, i18n);
      break;
    case 'posts':
      renderPostsBlock(watchedState, elements, i18n);
      break;
    case 'loadingProcess.status':
    case 'loadingProcess.error': {
      const { loadingProcess } = watchedState;
      handleLoadingProcess(loadingProcess.status, loadingProcess.error, elements, i18n);
      break;
    }
    case 'form.status':
    case 'form.error': {
      const { form } = watchedState;
      processRssFormStatus(form.status, form.error, elements, i18n);
      break;
    }
    case 'watchedPost':
      if (value !== null) {
        showModal(value, elements);
      }
      break;
    case 'uiState.readPosts':
      markReadPost(watchedState.uiState.readPosts.at(-1));
      break;
    case 'currentLanguage':
      processChangeLanguage(value, elements, i18n);
      renderPostsBlock(watchedState, elements, i18n);
      renderRssBlock(watchedState, elements, i18n);
      break;
    default:
      throw new Error(`Unknown app state: ${value}`);
  }
};

export default render;
