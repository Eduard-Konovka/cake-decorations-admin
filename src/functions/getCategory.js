export function getCategory(language, categories, product) {
  const category = categories.filter(obj => obj._id === product.category);

  return language === 'RU' ? category[0]?.ruTitle : category[0]?.uaTitle;
}
