import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from 'db';

export async function saveProfileToDatabase() {
  if (auth.currentUser) {
    const { uid, displayName, email, photoURL } = await auth.currentUser;

    const usersDevisesRef = doc(db, 'users', uid);

    await setDoc(
      usersDevisesRef,
      {
        user: displayName,
        email,
        phone: photoURL,
      },
      { merge: true },
    );
  }
}
