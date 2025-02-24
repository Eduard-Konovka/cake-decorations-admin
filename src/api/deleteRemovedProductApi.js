import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'db';
import { toast } from 'react-toastify';

export default async function deleteRemovedProductApi(removedProduct) {
  try {
    await deleteDoc(doc(db, 'products', removedProduct._id));
    // FIXME
    toast.success(
      `Товар "${removedProduct.title}" успішно видалено з каталогу товарів`,
    );
  } catch (error) {
    // FIXME
    toast.error(`Помилка видалення товару: ${error}`);
  }
}
