import { getPureArr } from './getPureArr';

export function getTags(title, dictionary, flag) {
  const titleArr = title.split(' ');
  const titlePureArr = getPureArr(titleArr);

  const tags = [];

  for (let i = 0; i < titlePureArr.length; i++) {
    for (let j = 0; j < dictionary.length; j++) {
      if (flag === 'tags') {
        for (let l = 0; l < dictionary[j].queries.length; l++) {
          if (
            (new RegExp(`^${dictionary[j].queries[l]}`).test(titlePureArr[i]) ||
              new RegExp(`-${dictionary[j].queries[l]}`).test(
                titlePureArr[i],
              )) &&
            !tags.includes(dictionary[j])
          ) {
            tags.push(dictionary[j]);
          }
        }
      } else {
        if (
          titlePureArr[i].startsWith(dictionary[j]) &&
          !tags.includes(dictionary[j])
        ) {
          tags.push(dictionary[j]);
        }
      }
    }
  }

  return tags;
}
