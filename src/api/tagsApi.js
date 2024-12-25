import { collection, getDocs } from 'firebase/firestore';
import { db } from 'db';

export default async function tagsApi() {
  const tagsRef = collection(db, 'tags');
  const tagsSnapshot = await getDocs(tagsRef);

  const tagsArr = [];

  tagsSnapshot.forEach(tag =>
    tagsArr.push({
      ...tag.data(),
    }),
  );

  return tagsArr;
}
