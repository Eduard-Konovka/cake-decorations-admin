import { titleWrapper } from 'middlewares';

export function getCategory(language, categories, product) {
  const category = categories.filter(obj => obj._id === product.category);

  return titleWrapper(language, category[0]);
}
