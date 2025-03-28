import { doc, getDoc } from 'firebase/firestore';
import { db } from 'db';

export async function getProfileFromDatabase(uid) {
  const userRef = doc(db, 'users', uid);
  const userSnapshot = await getDoc(userRef);

  return userSnapshot.data();
}
