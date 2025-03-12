import { collection, getDocs } from 'firebase/firestore';
import { db } from 'db';

export default async function collectionApi(collectionName) {
  const collectionRef = collection(db, collectionName);
  const collectionSnapshot = await getDocs(collectionRef);

  const collectionArr = [];

  collectionSnapshot.forEach(collectionItem =>
    collectionArr.push({
      _id: collectionItem.id,
      ...collectionItem.data(),
    }),
  );

  return collectionArr;
}
