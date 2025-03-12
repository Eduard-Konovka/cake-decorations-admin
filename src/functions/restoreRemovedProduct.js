import { toast } from 'react-toastify';
import { updateProducts, updateRemovedProducts } from 'state';
import { addProductApi, deleteRemovedProductApi, fetchCollection } from 'api';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

export async function restoreRemovedProduct(
  removedProduct,
  title,
  changeGlobalState,
  navigate,
) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  await addProductApi(removedProduct, title);
  await deleteRemovedProductApi(removedProduct, title);

  fetchCollection('removedProduct')
    .then(products => {
      products.sort(
        (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
      );
      changeGlobalState(updateProducts, products);
      navigate(`/products`);
    })
    .catch(error =>
      toast.error(
        `${languageDeterminer(
          LANGUAGE.toastErrors.gettingProducts,
        )}:\n${error}`,
      ),
    );

  fetchCollection('removedProducts')
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
          LANGUAGE.toastErrors.gettingRemovedProducts,
        )}:\n${error}`,
      ),
    );
}
