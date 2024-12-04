import products from 'db/products.json';

export default async function productApi(id) {
  const response = await products;
  const productArr = response.filter(obj => obj._id === id);

  return productArr[0];
}
