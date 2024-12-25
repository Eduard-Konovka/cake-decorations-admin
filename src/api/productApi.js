import { doc, getDoc } from 'firebase/firestore';
import { db } from 'db';

export default async function productApi(id) {
  const docRef = doc(db, 'products', id);
  const docSnapshot = await getDoc(docRef);

  return docSnapshot.data();
}
