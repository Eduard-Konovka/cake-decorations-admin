import { db } from 'db';
import { doc, getDoc } from 'firebase/firestore';

export default async function productApi(id) {
  const docRef = doc(db, 'products', id);
  const docSnapshot = await getDoc(docRef);

  return docSnapshot.data();
}
