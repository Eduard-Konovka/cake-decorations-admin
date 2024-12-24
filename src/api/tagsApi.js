import { db } from 'db';
import { collection, getDocs } from 'firebase/firestore';

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
