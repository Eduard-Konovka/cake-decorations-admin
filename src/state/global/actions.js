import { storeLanguage } from 'functions';

const actions = {
  updateLanguage: (state, payload) => {
    storeLanguage(payload);

    const updatedState = { ...state };
    updatedState.global.language = payload;
    return updatedState;
  },

  updateMainHeight: (state, payload) => {
    const updatedState = { ...state };
    updatedState.global.mainHeight = payload;
    return updatedState;
  },

  updateUser: (state, payload) => {
    localStorage.setItem('user', JSON.stringify(payload));

    const updatedState = { ...state };
    updatedState.global.user = payload;
    return updatedState;
  },

  updateCategories: (state, payload) => {
    const updatedState = { ...state };
    updatedState.global.categories = payload;
    return updatedState;
  },

  updateProducts: (state, payload) => {
    const updatedState = { ...state };
    updatedState.global.products = payload;
    return updatedState;
  },

  updateCart: (state, payload) => {
    localStorage.setItem('cart', JSON.stringify(payload));

    const updatedState = { ...state };
    updatedState.global.cart = payload;
    return updatedState;
  },
};

export const {
  updateLanguage,
  updateMainHeight,
  updateUser,
  updateCategories,
  updateProducts,
  updateCart,
} = actions;
