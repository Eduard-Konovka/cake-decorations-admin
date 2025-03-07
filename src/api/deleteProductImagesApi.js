import { ref, deleteObject } from 'firebase/storage';
import { storage } from 'db';
import { toast } from 'react-toastify';

export default async function deleteProductImagesApi(product, title) {
  if (product.images && product.images.length > 0) {
    try {
      for (let i = 0; i < product.images.length; i++) {
        await deleteObject(
          ref(storage, `productsImages/${product._id}/${product.images[i].id}`),
        );
      }

      // FIXME
      toast.success(
        `Зображення товару "${title}" успішно видалено з каталогу товарів`,
      );
    } catch (error) {
      // FIXME
      toast.error(`Помилка видалення зображень товару: ${error}`);
    }
  } else return;
}
