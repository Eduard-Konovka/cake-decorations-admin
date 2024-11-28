import { db } from 'db';
import { doc, getDoc } from 'firebase/firestore';

export default async function linksApi() {
  const docRef = doc(db, 'links', 'links');
  const docSnapshot = await getDoc(docRef);

  return docSnapshot.data().links;
}
