import { db } from 'db';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default async function addProductApi(newProduct) {
  try {
    await setDoc(doc(db, 'products', newProduct._id), newProduct);
  } catch (error) {
    // FIXME
    toast.error(`Помилка створення нового товару: ${error}`);
  }

  // FIXME
  toast.success(`Товар ${newProduct.title} успішно додано в каталог товарів`);
}
