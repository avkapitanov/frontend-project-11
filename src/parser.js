import { APP_ERRORS } from './const';

const parseRssInfo = (parsedDoc) => {
  const rssTitle = parsedDoc.querySelector('channel > title').textContent;
  const rssDescription = parsedDoc.querySelector('channel > description').textContent;

  return {
    title: rssTitle,
    description: rssDescription,
  };
};

const parseItems = (parsedDoc) => {
  const items = parsedDoc.querySelectorAll('item');
  return Array.from(items).map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const itemLink = item.querySelector('link').textContent;

    return {
      title: itemTitle,
      description: itemDescription,
      link: itemLink,
    };
  });
};

const parseData = (data) => {
  const parser = new DOMParser();

  const parsedDoc = parser.parseFromString(data, 'application/xml');
  const errorNode = parsedDoc.querySelector('parsererror');
  if (errorNode) {
    const err = new Error(APP_ERRORS.INVALID_RSS);
    err.parseErrorText = errorNode.textContent;
    throw err;
  }

  return {
    rssFeed: parseRssInfo(parsedDoc),
    posts: parseItems(parsedDoc),
  };
};

export default parseData;
