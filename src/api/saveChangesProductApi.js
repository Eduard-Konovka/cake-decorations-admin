import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from 'db';

export default async function saveChangesProductApi(newProduct, title) {
  try {
    await updateDoc(doc(db, 'products', newProduct._id), newProduct);

    // FIXME
    toast.success(`Товар ${title} успішно змінено в каталозі товарів`);
  } catch (error) {
    // FIXME
    toast.error(`Помилка змінення товару: ${error}`);
  }
}
