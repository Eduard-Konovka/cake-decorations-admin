import { ref, deleteObject } from 'firebase/storage';
import { storage } from 'db';
import { toast } from 'react-toastify';

export default async function deleteImageApi(imagesIds, _id, title) {
  if (imagesIds && imagesIds.length > 0) {
    try {
      for (let i = 0; i < imagesIds.length; i++) {
        await deleteObject(
          ref(storage, `productsImages/${_id}/${imagesIds[i]}`),
        );
      }

      // FIXME
      toast.success(
        `Старі зображення товару "${title}" успішно видалено з сервера`,
      );
    } catch (error) {
      // FIXME
      toast.error(
        `Помилка видалення старих зображень товару з сервера: ${error}`,
      );
    }
  } else return;
}
