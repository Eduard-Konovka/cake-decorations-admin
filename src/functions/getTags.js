export function getTags(title, tamplate) {
  const arr = title.split(' ');

  const pureArr = arr.map(word =>
    word
      .split('')
      .filter(el => el !== ':')
      .filter(el => el !== ',')
      .filter(el => el !== '"')
      .filter(el => el !== '“')
      .filter(el => el !== '”')
      .filter(el => el !== '(')
      .filter(el => el !== ')')
      .join(''),
  );

  const tags = [];

  for (let i = 0; i < pureArr.length; i++) {
    for (let j = 0; j < tamplate.length; j++) {
      if (pureArr[i] === tamplate[j] && !tags.includes(pureArr[i])) {
        tags.push(tamplate[j]);
      }
    }
  }

  return tags;
}
