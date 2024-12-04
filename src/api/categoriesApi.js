import categories from 'db/categories.json';

export default async function categoriesApi() {
  const response = await categories;

  return response;
}
