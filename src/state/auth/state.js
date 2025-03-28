export const initialUser = {
  uid: null,
  avatar: '',
  firstName: '',
  lastName: '',
  fullName: '',
  phone: '',
  locality: '',
  address: '',
  delivery: '',
  email: '',
};

export const auth = {
  user: JSON.parse(localStorage.getItem('user')) || { ...initialUser },
};
