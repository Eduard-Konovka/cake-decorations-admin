import db from 'db/db.json';

export default async function productsApi() {
  const response = await db;

  /*
  const tagsObj = new Set();
  response.forEach(product => {
    const arr = product.title.split(' ');

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

    pureArr.forEach(word => tagsObj.add(word.toLowerCase()));
  });
  const tags = Array.from(tagsObj);
  const ascendingTags = tags.sort().sort((a, b) => a.length - b.length);
  console.log(ascendingTags);
  */

  return response;
}
