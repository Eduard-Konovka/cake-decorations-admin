import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'db';
import { toast } from 'react-toastify';

export default async function deleteProductApi(product) {
  try {
    await deleteDoc(doc(db, 'products', product._id));
    // FIXME
    toast.success(
      `Товар "${product.title}" успішно видалено з каталогу товарів`,
    );
  } catch (error) {
    // FIXME
    toast.error(`Помилка видалення товару: ${error}`);
  }
}
