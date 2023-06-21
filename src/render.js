export const renderFeedsList = ({ rss }) => {
  const rssListWrapper = document.querySelector('.rss-list-wrapper');

  if (rss.length > 0) {
    const rssList = document.querySelector('.rss-list');
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
    return;
  }
  rssListWrapper.classList.add('d-none');
};

export const renderPosts = (state, i18n) => {
  const { posts } = state;
  const postsListWrapper = document.querySelector('.posts-list-wrapper');

  if (posts.length > 0) {
    const postList = document.querySelector('.posts-list');
    postList.innerHTML = '';
    postsListWrapper.classList.remove('d-none');
    const list = document.createElement('ul');
    list.classList.add('list-group', 'border-0', 'rounded-0');
    posts.forEach((post) => {
      const { id, title, link } = post;
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const postTitle = document.createElement('a');
      const classesToPost = state.uiState.readPosts.includes(id) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];
      postTitle.classList.add(...classesToPost);
      postTitle.textContent = title;
      postTitle.setAttribute('href', link);
      postTitle.setAttribute('target', '_blank');
      postTitle.setAttribute('data-post-id', id);
      listItem.append(postTitle);

      const postMoreBtn = document.createElement('button');
      postMoreBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postMoreBtn.textContent = i18n.t('postsList.view');
      postMoreBtn.setAttribute('data-post-id', id);
      postMoreBtn.dataset.bsToggle = 'modal';
      postMoreBtn.dataset.bsTarget = '#post-detail-modal';
      listItem.append(postMoreBtn);

      list.append(listItem);
    });
    postList.append(list);
    return;
  }
  postsListWrapper.classList.add('d-none');
};

export const renderRssFormStatusMessage = (text, type) => {
  const feedback = document.querySelector('.feedback');
  const removeCls = type === 'success' ? 'danger' : 'success';
  feedback.innerHTML = text;

  feedback.classList.add(`text-${type}`);
  feedback.classList.remove(`text-${removeCls}`);
};
