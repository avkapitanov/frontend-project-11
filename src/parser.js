const parseData = (data) => {
  const parser = new DOMParser();

  const parsedDoc = parser.parseFromString(data, 'application/xml');
  const errorNode = parsedDoc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('rssFormStatuses.invalidRSS');
  }

  const rssTitle = parsedDoc.querySelector('channel > title').textContent;
  const rssDescription = parsedDoc.querySelector('channel > description').textContent;

  const rssFeed = {
    title: rssTitle,
    description: rssDescription,
  };

  const items = parsedDoc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const itemLink = item.querySelector('link').textContent;

    return {
      title: itemTitle,
      description: itemDescription,
      link: itemLink,
    };
  });

  return {
    rssFeed,
    posts,
  };
};

export default parseData;
