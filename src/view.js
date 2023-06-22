const renderFeedsList = (state, elements) => {
  const { rss } = state;
  const { rssList, rssListWrapper } = elements;
  if (rss.length === 0) {
    rssListWrapper.classList.add('d-none');
    return;
  }

  rssList.innerHTML = '';
  rssListWrapper.classList.remove('d-none');
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
  const { postsListWrapper, postList } = elements;

  if (posts.length === 0) {
    postsListWrapper.classList.add('d-none');
    return;
  }

  postList.innerHTML = '';
  postsListWrapper.classList.remove('d-none');
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

const renderRssFormStatusMessage = (text, type) => {
  const feedback = document.querySelector('.feedback');
  const removeCls = type === 'success' ? 'danger' : 'success';
  feedback.innerHTML = text;

  feedback.classList.add(`text-${type}`);
  feedback.classList.remove(`text-${removeCls}`);
};

const render = (path, value, watchedState, i18n, elements) => {
  switch (path) {
    case 'rss':
      renderFeedsList(watchedState, elements);
      break;
    case 'posts':
      renderPosts(watchedState, elements, i18n);
      break;
    case 'rssFormState': {
      const type = value === 'loaded' ? 'success' : 'danger';
      renderRssFormStatusMessage(i18n.t(`rssFormStatuses.${value}`), type);
      if (value === 'start') {
        elements.addBtnSpinner.classList.remove('visually-hidden');
      }
      if (value === 'loaded') {
        elements.rssFormInput.classList.remove('is-invalid');
        elements.rssAddForm.reset();
        elements.rssFormInput.focus();
        elements.addBtnSpinner.classList.add('visually-hidden');
      }
      if (value === 'error') {
        elements.rssFormInput.classList.add('is-invalid');
        elements.addBtnSpinner.classList.add('visually-hidden');
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
};

export default render;
