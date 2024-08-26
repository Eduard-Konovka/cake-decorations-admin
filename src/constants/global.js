const ENTER_KEY_CODE = 13;

export const GLOBAL = {
  signInViewInput: {
    minLength: 4,
    maxLength: 16,
  },

  signInViewPattern: `^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$`,

  keyСodes: {
    enter: ENTER_KEY_CODE,
    zero: 48,
    prohibited: [
      ENTER_KEY_CODE, // Enter
      44, // ,
      46, // .
      101, // e (scientific notaion, 1e2 === 100)
    ],
  },

  productCount: {
    min: 1,
    max: 42,
  },

  pricesBreakPoint: {
    min: 0,
    first: 15,
    second: 30,
  },

  titleLength: 75,

  sending: 3000,

  dozen: 12,
};
