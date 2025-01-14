import { toast } from 'react-toastify';
import { updateProducts } from 'state';
import { deleteImagesApi, deleteProductApi, fetchProducts } from 'api';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

export async function deleteProduct(product, changeGlobalState, navigate) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  await deleteImagesApi(product);
  await deleteProductApi(product);

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
