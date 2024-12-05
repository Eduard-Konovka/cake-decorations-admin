import { toast } from 'react-toastify';
import { collection, addDoc } from 'firebase/firestore';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import { db } from 'db';

export default async function ordersApi(data) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  try {
    const docRef = await addDoc(collection(db, 'orders'), data);

    return toast.success(
      `${languageDeterminer(LANGUAGE.order.status)}${
        docRef.id
      }${languageDeterminer(LANGUAGE.order.success)}`,
    );
  } catch (error) {
    return toast.error(
      `${languageDeterminer(LANGUAGE.order.error)}${error.message}`,
    );
  }
}
