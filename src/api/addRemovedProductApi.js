import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from 'db';

export default async function addRemovedProductApi(removedProduct, title) {
  try {
    await setDoc(
      doc(db, 'removedProducts', removedProduct._id),
      removedProduct,
    );

    // FIXME
    toast.success(`Товар ${title} успішно переміщено у видалені товари`);
  } catch (error) {
    // FIXME
    toast.error(`Помилка переміщення товару: ${error}`);
  }
}
