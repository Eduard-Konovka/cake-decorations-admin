import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from 'db';

export default async function addProductApi(newProduct, title) {
  try {
    await setDoc(doc(db, 'products', newProduct._id), newProduct);

    // FIXME
    toast.success(`Товар ${title} успішно додано в каталог товарів`);
  } catch (error) {
    // FIXME
    toast.error(`Помилка створення нового товару: ${error}`);
  }
}
