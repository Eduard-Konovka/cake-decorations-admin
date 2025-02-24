import { toast } from 'react-toastify';
import { updateProducts } from 'state';
import {
  addRemovedProductApi,
  deleteRemovedProductApi,
  fetchProducts,
} from 'api';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

export async function removeProduct(product, changeGlobalState, navigate) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  await addRemovedProductApi(product);
  await deleteRemovedProductApi(product);

  fetchProducts()
    .then(products => {
      products.sort(
        (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
      );
      changeGlobalState(updateProducts, products);
      navigate('/products');
    })
    .catch(error =>
      toast.error(
        `${languageDeterminer(
          LANGUAGE.toastErrors.gettingProducts,
        )}:\n${error}`,
      ),
    );
}
