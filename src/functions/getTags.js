import tegsDictionary from 'db/tags.json';

export function getTags(title) {
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

  const tags = [];

  for (let i = 0; i < titlePureArr.length; i++) {
    for (let j = 0; j < tegsDictionary.length; j++) {
      for (let l = 0; l < tegsDictionary[j].queries.length; l++) {
        if (
          (new RegExp(`^${tegsDictionary[j].queries[l]}`).test(
            titlePureArr[i],
          ) ||
            new RegExp(` ${tegsDictionary[j].queries[l]}`).test(
              titlePureArr[i],
            ) ||
            new RegExp(`-${tegsDictionary[j].queries[l]}`).test(
              titlePureArr[i],
            )) &&
          !tags.includes(tegsDictionary[j])
        ) {
          tags.push(tegsDictionary[j]);
        }
      }
    }
  }

  return tags;
}
