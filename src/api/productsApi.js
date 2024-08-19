import { db } from 'db';

// FIXME ordinalOfDozen
export default async function productsApi(ordinalOfDozen) {
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
  console.log(tags);
  */

  return response;
}
