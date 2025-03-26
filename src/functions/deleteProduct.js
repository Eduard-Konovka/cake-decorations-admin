import { toast } from 'react-toastify';
import { updateProducts, updateRemovedProducts } from 'state';
import { addRemovedProductApi, deleteProductApi, fetchCollection } from 'api';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

export async function deleteProduct(
  product,
  title,
  changeGlobalState,
  navigate,
) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  await addRemovedProductApi(product, title);
  await deleteProductApi(product, title);

  fetchCollection('products')
    .then(products => {
      products.sort(
        (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
      );
      changeGlobalState(updateProducts, products);
      navigate('/categories');
    })
    .catch(error =>
      toast.error(
        `${languageDeterminer(
          LANGUAGE.toastErrors.productsGetting,
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
          LANGUAGE.toastErrors.removedProductsGetting,
        )}:\n${error}`,
      ),
    );
}
