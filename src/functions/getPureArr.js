export function getPureArr(wordArr) {
  const pureArr = wordArr.map(word =>
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

  return pureArr;
}
