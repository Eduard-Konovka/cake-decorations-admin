import { db } from 'db';
import { collection, getDocs } from 'firebase/firestore';

export default async function productsApi() {
  const productsRef = collection(db, 'products');
  const productsSnapshot = await getDocs(productsRef);

  const productsArr = [];

  productsSnapshot.forEach(product =>
    productsArr.push({
      ...product.data(),
    }),
  );

  return productsArr;
}
