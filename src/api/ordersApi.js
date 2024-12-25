import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { db } from 'db';
import { LANGUAGE } from 'constants';

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
