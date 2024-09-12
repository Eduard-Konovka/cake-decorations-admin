import db from 'db/db.json';

export default async function productApi(id) {
  const response = await db;
  const productArr = response.filter(obj => obj._id === id);

  return productArr[0];
}
