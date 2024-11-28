import { db } from 'db';
import { collection, getDocs } from 'firebase/firestore';

export default async function categoriesApi() {
  const categoriesRef = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesRef);

  const categoriesArr = [];

  categoriesSnapshot.forEach(category =>
    categoriesArr.push({
      _id: category.id,
      ...category.data(),
    }),
  );

  return categoriesArr;
}
