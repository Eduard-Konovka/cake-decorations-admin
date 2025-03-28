import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from 'db';
import { updateUserProfile } from './actions';
import { getProfileFromDatabase } from 'functions';
import { initialUser } from 'state';
import { toast } from 'react-toastify';

export const authSignInUser = async (
  state,
  { user, errorTitle },
  changeGlobalState,
) => {
  const { email, password } = user;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    const newUser = await getProfileFromDatabase(auth.currentUser.uid);

    return changeGlobalState(updateUserProfile, newUser);
  } catch (error) {
    toast.error(`${errorTitle}: ${error.message}`);
  }
};

export const authSignOutUser = async (state, payload, changeGlobalState) => {
  await signOut(auth);

  return changeGlobalState(updateUserProfile, initialUser);
};

export const authStateChange = async (state, payload, changeGlobalState) => {
  await onAuthStateChanged(auth, user => {
    if (user) {
      const newUser = {
        uid: user.uid,
        fullName: user.displayName,
      };

      changeGlobalState(updateUserProfile, newUser);
    }
  });
};
