import { toast } from 'react-toastify';
import { updateProducts, updateRemovedProducts } from 'state';
import {
  deleteProductImagesApi,
  deleteRemovedProductApi,
  fetchCollection,
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

  fetchCollection('removedProducts')
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
          LANGUAGE.toastErrors.removedProductsGetting,
        )}:\n${error}`,
      ),
    );

  fetchCollection('products')
    .then(products => {
      products.sort(
        (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
      );
      changeGlobalState(updateProducts, products);
    })
    .catch(error =>
      toast.error(
        `${languageDeterminer(
          LANGUAGE.toastErrors.productsGetting,
        )}:\n${error}`,
      ),
    );
}
