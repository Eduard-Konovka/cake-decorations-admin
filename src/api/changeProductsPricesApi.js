import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'db';

export default async function changeProductsPricesApi(products) {
  try {
    for (let i = 0; i < products.length; i++) {
      await updateDoc(doc(db, 'products', products[i]._id), {
        price: products[i].price,
      });
    }

    return 'success';
  } catch (error) {
    return error.message;
  }
}
