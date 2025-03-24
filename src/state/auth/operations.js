import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from 'db';
import { updateUserProfile } from './actions';
import { toast } from 'react-toastify';

export const authSignInUser = async (state, { user, errorTitle }) => {
  const { email, password } = user;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    toast.error(`${errorTitle}: ${error.message}`);
  }
};

export const authSignOutUser = async (state, payload, changeGlobalState) => {
  await signOut(auth);

  const initialState = {
    name: null,
    userId: null,
  };

  changeGlobalState(updateUserProfile, initialState);
};

export const authStateChangeUser = async (
  state,
  payload,
  changeGlobalState,
) => {
  await onAuthStateChanged(auth, user => {
    if (user) {
      const userUpdateProfile = {
        name: user.displayName,
        userId: user.uid,
      };

      changeGlobalState(updateUserProfile, userUpdateProfile);
    }
  });
};
