import { collection, getDocs } from 'firebase/firestore';
import { db } from 'db';

export default async function removedProductsApi() {
  const removedProductsRef = collection(db, 'removedProducts');
  const removedProductsSnapshot = await getDocs(removedProductsRef);

  const removedProductsArr = [];

  removedProductsSnapshot.forEach(removedProduct =>
    removedProductsArr.push({
      ...removedProduct.data(),
    }),
  );

  return removedProductsArr;
}
