import { db } from 'db';

export default async function productsApi(ordinalOfDozen) {
  const response = await db;
  const nextProducts = response.slice(
    ordinalOfDozen * 12 - 12,
    ordinalOfDozen * 12,
  );

  return nextProducts;
}
