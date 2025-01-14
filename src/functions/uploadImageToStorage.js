import { toast } from 'react-toastify';
import { languageWrapper } from 'middlewares';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from 'db';
import { PHOTO } from 'constants';

export async function uploadImageToStorage(language, photo, productTimeStamp) {
  const languageDeterminer = obj => languageWrapper(language, obj);
  const uniqueImageId = Date.now().toString();
  const storageRef = ref(
    storage,
    `productsImages/${productTimeStamp}/${uniqueImageId}`,
  );

  await uploadBytes(storageRef, photo)
    .then(() =>
      toast.success(
        `${languageDeterminer(
          PHOTO.alert.uploadError.success.title,
        )} ${languageDeterminer(PHOTO.alert.uploadError.success.description)}`,
      ),
    )
    .catch(error =>
      toast.error(
        `${languageDeterminer(PHOTO.alert.uploadError.error)}: ${error}`,
      ),
    );

  return {
    url: await getDownloadURL(
      ref(storage, `productsImages/${productTimeStamp}/${uniqueImageId}`),
    ),
    id: uniqueImageId,
  };
}
