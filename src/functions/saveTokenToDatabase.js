import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from 'db';

export async function saveTokenToDatabase(token, userId) {
  const userDevisesRef = doc(db, 'users', userId);

  userDevisesRef
    ? await updateDoc(
        userDevisesRef,
        {
          tokens: arrayUnion(token),
        },
        { merge: true },
      )
    : await setDoc(
        userDevisesRef,
        {
          tokens: [token],
        },
        { merge: true },
      );
}
