import { doc, getDoc } from 'firebase/firestore';
import { db } from 'db';

export default async function linksApi() {
  const docRef = doc(db, 'links', 'links');
  const docSnapshot = await getDoc(docRef);

  return docSnapshot.data().links;
}
