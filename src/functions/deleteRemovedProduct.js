import { toast } from 'react-toastify';
import { updateProducts, updateRemovedProducts } from 'state';
import {
  deleteProductImagesApi,
  deleteRemovedProductApi,
  fetchProducts,
  fetchRemovedProducts,
} from 'api';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

export async function deleteRemovedProduct(
  removedProduct,
  title,
  changeGlobalState,
  navigate,
) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  await deleteProductImagesApi(removedProduct, title);
  await deleteRemovedProductApi(removedProduct, title);

  fetchRemovedProducts()
    .then(removedProducts => {
      removedProducts.sort(
        (firstRemovedProduct, secondRemovedProduct) =>
          secondRemovedProduct._id - firstRemovedProduct._id,
      );
      changeGlobalState(updateRemovedProducts, removedProducts);
      navigate('/removedProducts');
    })
    .catch(error =>
      toast.error(
        `${languageDeterminer(
          LANGUAGE.toastErrors.gettingRemovedProducts,
        )}:\n${error}`,
      ),
    );

  fetchProducts()
    .then(products => {
      products.sort(
        (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
      );
      changeGlobalState(updateProducts, products);
    })
    .catch(error =>
      toast.error(
        `${languageDeterminer(
          LANGUAGE.toastErrors.gettingProducts,
        )}:\n${error}`,
      ),
    );
}
