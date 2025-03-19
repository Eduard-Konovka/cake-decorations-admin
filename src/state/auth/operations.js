import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth } from 'db';
import { updateUserProfile, authSignOut, authStateChange } from './actions';
import { toast } from 'react-toastify';

export const authSignUpUser = async (
  state,
  { user, errorTitle },
  changeGlobalState,
) => {
  const { email, name, phone, password } = user;

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    const user = await auth.currentUser;

    await updateProfile(user, {
      displayName: name,
      photoURL: phone,
    });

    const { uid } = await auth.currentUser;

    const userUpdateProfile = {
      userId: uid,
      name,
    };

    return changeGlobalState(updateUserProfile, userUpdateProfile);
  } catch (error) {
    toast.error(errorTitle, error.message);
  }
};

export const authSignInUser = async (state, { user, errorTitle }) => {
  const { email, password } = user;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    toast.error(errorTitle, error.message);
  }
};

export const authSignOutUser = async state => {
  await signOut(auth);

  const initialState = {
    name: null,
    userId: null,
    stateChange: false,
  };

  return authSignOut(state, initialState);
};

export const authStateChangeUser = async (
  state,
  payload,
  changeGlobalState,
) => {
  await onAuthStateChanged(auth, user => {
    if (user) {
      const userUpdateProfile = {
        userId: user.uid,
        name: user.displayName,
      };

      changeGlobalState(updateUserProfile, userUpdateProfile);
      changeGlobalState(authStateChange, true);
    }
  });
};
