import { toast } from 'react-toastify';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

export default async function ordersApi(data) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  try {
    // const response = await axios.post('/api/orders', data);
    const response = { status: '200' };

    return toast.success(
      `${languageDeterminer(LANGUAGE.order.status)}${
        response.status
      }${languageDeterminer(LANGUAGE.order.success)}`,
    );
  } catch (error) {
    return toast.error(
      `${languageDeterminer(LANGUAGE.order.error)}${error.message}`,
    );
  }
}
