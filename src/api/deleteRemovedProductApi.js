import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'db';
import { toast } from 'react-toastify';

export default async function deleteRemovedProductApi(removedProduct, title) {
  try {
    await deleteDoc(doc(db, 'removedProducts', removedProduct._id));

    // FIXME
    toast.success(`Товар "${title}" успішно видалено`);
  } catch (error) {
    // FIXME
    toast.error(`Помилка видалення товару: ${error}`);
  }
}
