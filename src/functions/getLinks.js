export function getLinks(title, dictionary) {
  const titleArr = title.split(' ');

  const titlePureArr = titleArr.map(word =>
    word
      .toLowerCase()
      .split('')
      .filter(el => el !== ':')
      .filter(el => el !== ',')
      .filter(el => el !== '"')
      .filter(el => el !== '“')
      .filter(el => el !== '”')
      .filter(el => el !== '«')
      .filter(el => el !== '»')
      .filter(el => el !== '(')
      .filter(el => el !== ')')
      .join(''),
  );

  const links = [];

  for (let i = 0; i < titlePureArr.length; i++) {
    for (let j = 0; j < dictionary.length; j++) {
      if (
        titlePureArr[i].startsWith(dictionary[j]) &&
        !links.includes(dictionary[j])
      ) {
        links.push(dictionary[j]);
      }
    }
  }

  return links;
}
