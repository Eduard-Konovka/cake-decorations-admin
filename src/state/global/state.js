import { getLanguage } from 'functions';

export const global = {
  mainHeight: null,
  language: getLanguage(),
  categories: [],
  products: [],
  removedProducts: [],
  tagsDictionary: null,
  linksDictionary: null,
  orders: JSON.parse(localStorage.getItem('orders')) || [],
};
