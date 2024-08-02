import { db } from 'db';

export default async function productApi(id) {
  const response = await db;
  const productArr = response.filter(obj => obj._id === id);

  return productArr[0];
}
