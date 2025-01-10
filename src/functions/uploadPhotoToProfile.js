import { toast } from 'react-toastify';
import { languageWrapper } from 'middlewares';
import { uriToBlob } from './uriToBlob';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { storage, db } from 'db';
import { PHOTO } from 'constants';

export async function uploadPhotoToProfile(language, photo, userId) {
  const photoObj = await uploadPhotoToServer(language, photo, userId);
  const languageDeterminer = obj => languageWrapper(language, obj);

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { photos: arrayUnion(photoObj) }, { merge: true });
  } catch (error) {
    toast.error(`${languageDeterminer(PHOTO.alert.addingError)}: ${error}`);
    console.log(`${languageDeterminer(PHOTO.alert.addingError)}: ${error}`); // FIXME No document to update: projects/cake-decorations-by-chechina/databases/(default)/documents/users/defaultUser
  }
}

async function uploadPhotoToServer(language, photo, userId) {
  const blobFile = await uriToBlob(photo);
  const uniquePhotoId = Date.now().toString();
  const storageRef = ref(storage, `photos/${userId}/${uniquePhotoId}.jpg`);
  const languageDeterminer = obj => languageWrapper(language, obj);

  await uploadBytes(storageRef, blobFile)
    .then(() => {
      toast.success(
        `${languageDeterminer(
          PHOTO.alert.uploadError.success.title,
        )} ${languageDeterminer(PHOTO.alert.uploadError.success.description)}`,
      );
      console.log(
        `${languageDeterminer(
          PHOTO.alert.uploadError.success.title,
        )} ${languageDeterminer(PHOTO.alert.uploadError.success.description)}`, // FIXME delete this block
      );
    })
    .catch(error => {
      toast.error(
        `${languageDeterminer(PHOTO.alert.uploadError.error)}: ${error}`,
      );
      console.log(
        `${languageDeterminer(PHOTO.alert.uploadError.error)}: ${error}`, // FIXME delete this block
      );
    });

  return {
    url: await getDownloadURL(
      ref(storage, `photos/${userId}/${uniquePhotoId}.jpg`),
    ),
    id: uniquePhotoId,
  };
}
