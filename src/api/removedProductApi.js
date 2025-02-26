import { doc, getDoc } from 'firebase/firestore';
import { db } from 'db';

export default async function removedProductApi(id) {
  const docRef = doc(db, 'removedProducts', id);
  const docSnapshot = await getDoc(docRef);

  return docSnapshot.data();
}
