import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import { db } from 'db';

export default async function ordersApi(data) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  try {
    await setDoc(doc(db, 'orders', Date.now().toString()), data);

    // FIXME order.status
    return toast.success(
      `${languageDeterminer(LANGUAGE.order.status)}${200}${languageDeterminer(
        LANGUAGE.order.success,
      )}`,
    );
  } catch (error) {
    return toast.error(
      `${languageDeterminer(LANGUAGE.order.error)}${error.message}`,
    );
  }
}
