import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from 'db';

export default async function addRemovedProductApi(removedProduct) {
  try {
    await setDoc(
      doc(db, 'removedProducts', removedProduct._id),
      removedProduct,
    );

    // FIXME
    toast.success(
      `Товар ${removedProduct.title} успішно видалено з каталогу товарів`,
    );
  } catch (error) {
    // FIXME
    toast.error(`Помилка видалення товару: ${error}`);
  }
}
