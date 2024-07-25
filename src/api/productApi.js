import { db } from 'db';

export default async function productApi(id) {
  const response = await db;
  const product = response.filter(obj => obj._id === id);

  return product;
}
