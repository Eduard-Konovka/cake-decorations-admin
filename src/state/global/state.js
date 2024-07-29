import { getLanguage } from 'functions';

export const global = {
  mainHeight: null,
  language: getLanguage(),
  user: JSON.parse(localStorage.getItem('user')) || {},
  products: [],
  ordinalOfDozen: 0,
  cart: JSON.parse(localStorage.getItem('cart')) || [],
};
