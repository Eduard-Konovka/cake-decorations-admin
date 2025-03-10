import { propertyWrapper } from 'middlewares';

export function getCategory(language, categories, product) {
  const category = categories.filter(obj => obj._id === product.category);

  return propertyWrapper(language, category[0], 'title');
}
