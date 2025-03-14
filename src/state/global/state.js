import { getLanguage } from 'functions';

export const global = {
  mainHeight: null,
  language: getLanguage(),
  user: JSON.parse(localStorage.getItem('user')) || {},
  categories: [],
  products: [],
  removedProducts: [],
  tagsDictionary: null,
  linksDictionary: null,
  orders: JSON.parse(localStorage.getItem('orders')) || [],
};
