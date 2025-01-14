import { ref, deleteObject } from 'firebase/storage';
import { storage } from 'db';
import { toast } from 'react-toastify';

export default async function deleteImagesApi(product) {
  if (product.imagesIds && product.imagesIds.length > 0) {
    try {
      for (let i = 0; i < product.images.length; i++) {
        await deleteObject(
          ref(storage, `productsImages/${product._id}/${product.imagesIds[i]}`),
        );
      }

      // FIXME
      toast.success(
        `Зображення товару "${product.title}" успішно видалено з каталогу товарів`,
      );
    } catch (error) {
      // FIXME
      toast.error(`Помилка видалення зображень товару: ${error}`);
    }
  } else return;
}
