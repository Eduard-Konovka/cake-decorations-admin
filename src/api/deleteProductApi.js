import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from 'db';

export default async function deleteProductApi(product) {
  try {
    await deleteDoc(doc(db, 'products', product._id));
  } catch (error) {
    // FIXME
    toast.error(`Помилка видалення товару: ${error}`);
  }

  // FIXME
  toast.success(`Товар ${product.title} успішно видалено з каталогу товарів`);
}
