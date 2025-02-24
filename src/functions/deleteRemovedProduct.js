import { toast } from 'react-toastify';
import { updateProducts } from 'state';
import { deleteImagesApi, deleteRemovedProductApi, fetchProducts } from 'api';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

export async function deleteRemovedProduct(
  removedProduct,
  changeGlobalState,
  navigate,
) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  await deleteImagesApi(removedProduct);
  await deleteRemovedProductApi(removedProduct);

  fetchProducts()
    .then(removedProducts => {
      removedProducts.sort(
        (firstRemovedProduct, secondRemovedProduct) =>
          secondRemovedProduct._id - firstRemovedProduct._id,
      );
      changeGlobalState(updateProducts, removedProducts);
      navigate('/removedProducts/deleted');
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
