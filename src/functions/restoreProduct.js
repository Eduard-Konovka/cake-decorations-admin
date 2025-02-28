import { toast } from 'react-toastify';
import { updateProducts, updateRemovedProducts } from 'state';
import {
  addRemovedProductApi,
  addProductApi,
  deleteProductApi,
  fetchProducts,
  fetchRemovedProducts,
} from 'api';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

export async function restoreProduct(
  product,
  title,
  changeGlobalState,
  navigate,
) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  await addRemovedProductApi(product, title);
  await deleteProductApi(product, title);

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

  fetchRemovedProducts()
    .then(removedProducts => {
      removedProducts.sort(
        (firstRemovedProduct, secondRemovedProduct) =>
          secondRemovedProduct._id - firstRemovedProduct._id,
      );
      changeGlobalState(updateRemovedProducts, removedProducts);
    })
    .catch(error =>
      toast.error(
        `${languageDeterminer(
          // FIXME: Change gettingProducts to gettingRemovedProducts
          LANGUAGE.toastErrors.gettingProducts,
        )}:\n${error}`,
      ),
    );
}

//

export const oldRestoreProduct = async (
  removedProduct,
  title,
  changeGlobalState,
  navigate,
) => {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);
  const productTimeStamp = Date.now().toString();

  removedProduct._id = productTimeStamp;

  await addProductApi(removedProduct, title);

  fetchProducts()
    .then(products => {
      products.sort(
        (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
      );
      changeGlobalState(updateProducts, products);
      navigate(`/products/${removedProduct._id}`);
    })
    .catch(error =>
      toast.error(
        `${languageDeterminer(
          LANGUAGE.toastErrors.gettingProducts,
        )}:\n${error}`,
      ),
    );
};
