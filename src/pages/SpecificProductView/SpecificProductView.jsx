import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  updateCategories,
  updateProducts,
  updateTagsDictionary,
  updateLinksDictionary,
} from 'state';
import {
  fetchCollection,
  fetchProduct,
  fetchTags,
  fetchLinks,
  addProductApi,
} from 'api';
import {
  Spinner,
  Button,
  Tags,
  Links,
  CountForm,
  Modal,
  Confirm,
} from 'components';
import {
  getLanguage,
  getCategory,
  getTags,
  pageUp,
  deleteProduct,
  getFileFromUrl,
  uploadImageToStorage,
} from 'functions';
import { languageWrapper, propertyWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import s from './SpecificProductView.module.css';

export default function SpecificProductView({
  setProductsByTag,
  changeSelectCount,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mainHeight,
    language,
    categories,
    products,
    tagsDictionary,
    linksDictionary,
    orders,
  } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const productId = location.pathname.slice(10, location.pathname.length);
  const selectedProduct = orders.filter(
    product => product._id === productId,
  )[0];
  const savedProduct = products.filter(product => product._id === productId)[0];

  const [count, setCount] = useState(
    selectedProduct ? selectedProduct.count : 0,
  );

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCollection('categories')
        .then(categories => changeGlobalState(updateCategories, categories))
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.categoriesGetting,
            )}:\n${error}`,
          ),
        );
    }
  }, [categories, changeGlobalState]);

  useEffect(() => {
    if (products.length > 0) {
      setProduct(savedProduct);
    } else {
      setLoading(true);

      fetchProduct(productId)
        .then(product => setProduct(product))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
  }, [productId, products.length, savedProduct]);

  useEffect(() => {
    if (!tagsDictionary) {
      fetchTags()
        .then(tagsDictionary =>
          changeGlobalState(updateTagsDictionary, tagsDictionary),
        )
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.tagsGetting,
            )}:\n${error}`,
          ),
        );
    }

    if (!linksDictionary) {
      fetchLinks()
        .then(linksDictionary =>
          changeGlobalState(updateLinksDictionary, linksDictionary),
        )
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.linksGetting,
            )}:\n${error}`,
          ),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      product?.title?.['ua' || 'ru' || 'en'] &&
      tagsDictionary &&
      linksDictionary
    ) {
      setTags(
        getTags(
          propertyWrapper(language, product, 'title'),
          tagsDictionary,
          'tags',
        ),
      );
      setLinks(
        getTags(
          propertyWrapper(language, product, 'title'),
          linksDictionary,
          'links',
        ),
      );
    }
  }, [language, product, tagsDictionary, linksDictionary]);

  useEffect(() => {
    if (!product) return;

    const description =
      document.querySelector('#mobileDescription') ||
      document.querySelector('#desktopDescription');

    if (description) {
      description.innerHTML = propertyWrapper(language, product, 'description');
    }
  }, [language, product]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
  };

  const editProductHandler = () => {
    navigate(`/products/edit/${productId}`);
  };

  const duplicateProductHandler = async () => {
    setLoading(true);

    const productTimeStamp = Date.now().toString();

    const newImages = [];
    for (let i = 0; i < product.images.length; i++) {
      try {
        const file = await getFileFromUrl(
          product.images[i].url,
          `${Date.now().toString()}.jpg`,
        );

        const newImage = await uploadImageToStorage(
          language,
          { file, type: product.images[i]?.type || 'image' },
          productTimeStamp,
        );

        newImages.push(newImage);
      } catch (error) {
        setLoading(false);
        toast.error(
          `${languageDeterminer(LANGUAGE.toastErrors.imageUploading)}: ${
            error.message
          }`,
        );
        break;
      }
    }

    const newProduct = { ...product };
    newProduct._id = productTimeStamp;
    newProduct.count = count;
    newProduct.images = newImages;

    addProductApi(newProduct, propertyWrapper(language, newProduct, 'title'));

    fetchCollection('products')
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
            LANGUAGE.toastErrors.productsGetting,
          )}:\n${error}`,
        ),
      );
  };

  const deleteProductHandler = () => {
    setLoading(true);
    toggleConfirm();

    deleteProduct(
      product,
      propertyWrapper(language, product, 'title'),
      changeGlobalState,
      navigate,
    );
  };

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {loading && <Spinner size={70} color="red" />}

      {!loading && error && (
        <div className={s.errorBox}>
          <p className={s.errorLabel}>
            {languageDeterminer(LANGUAGE.viewError)}
          </p>
          <p className={s.errorText}>{error.message}</p>
        </div>
      )}

      {!loading && !error && product && (
        <>
          <div className={s.row}>
            <section className={s.imagesSection}>
              {product.images[mainImageIdx]?.type === 'video' ? (
                <video
                  src={product.images[mainImageIdx].url}
                  title={'Збільшити'} // FIXME
                  className={s.mainImage}
                  onClick={toggleModal}
                />
              ) : (
                <img
                  src={
                    product?.images?.length > 0
                      ? product.images[mainImageIdx].url
                      : imageNotFound
                  }
                  title={'Збільшити'} // FIXME
                  alt={propertyWrapper(language, product, 'title')}
                  draggable="false"
                  className={s.mainImage}
                  onClick={toggleModal}
                />
              )}

              {product?.images?.length > 1 && (
                <div className={s.additionalImagesBox}>
                  {product.images.map((imageObj, idx) =>
                    imageObj?.type === 'video' ? (
                      <video
                        key={imageObj.url}
                        src={imageObj.url}
                        className={s.additionalVideo}
                        onClick={() => setMainImageIdx(idx)}
                      />
                    ) : (
                      <img
                        key={imageObj.url}
                        src={imageObj.url}
                        alt={propertyWrapper(language, product, 'title')}
                        draggable="false"
                        className={s.additionalImage}
                        onClick={() => setMainImageIdx(idx)}
                      />
                    ),
                  )}
                </div>
              )}
            </section>

            <div className={s.thumb}>
              <div className={s.monitor}>
                <section className={s.statsSection}>
                  <h3 className={s.title}>
                    {propertyWrapper(language, product, 'title')}
                  </h3>
                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(LANGUAGE.productViews.category)}
                    </span>
                    {getCategory(language, categories, product)}
                  </p>

                  {product?.product_details?.['ua' || 'ru' || 'en']?.length >
                    0 &&
                    propertyWrapper(language, product, 'product_details').map(
                      detail => (
                        <p key={detail.attribute_name} className={s.stat}>
                          <span className={s.statName}>
                            {detail.attribute_name}:
                          </span>
                          {detail.attribute_value}
                        </p>
                      ),
                    )}
                </section>

                <section className={s.controlsSection}>
                  <p className={s.count}>
                    <span className={s.boldfont}>
                      {languageDeterminer(LANGUAGE.productViews.price)}
                    </span>
                    {product.price} ₴
                  </p>

                  <CountForm
                    value={count}
                    min={GLOBAL.productCount.min}
                    max={GLOBAL.productCount.max}
                    styles={{
                      formStyle: s.count,
                      labelStyle: s.boldfont,
                      inputStyle: s.input,
                    }}
                    setCount={count => {
                      setCount(count);
                      selectedProduct &&
                        changeSelectCount({
                          count,
                          _id: selectedProduct._id,
                        });
                    }}
                  />

                  <div className={s.buttonBox}>
                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.editButton.title,
                      )}
                      type="button"
                      styles={s.btn}
                      onClick={editProductHandler}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.editButton.text,
                      )}
                    </Button>

                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.duplicateButton.title,
                      )}
                      type="button"
                      styles={s.btn}
                      onClick={duplicateProductHandler}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.duplicateButton.text,
                      )}
                    </Button>

                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.deleteButton.title,
                      )}
                      type="button"
                      styles={s.btn}
                      onClick={toggleConfirm}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.deleteButton.text,
                      )}
                    </Button>
                  </div>
                </section>
              </div>

              {(tags.length > 0 || links.length > 0) && (
                <section className={s.linksSection}>
                  {tags.length > 0 && (
                    <div className={s.linksBox}>
                      <span className={s.statName}>
                        {languageDeterminer(LANGUAGE.productViews.tags)}
                      </span>

                      <Tags
                        tags={tags}
                        boxStyles={s.tagBox}
                        tagStyles={s.tag}
                        setProductsByTag={setProductsByTag}
                      />
                    </div>
                  )}

                  {links.length > 0 && (
                    <div className={s.linksBox}>
                      <span className={classNames(s.statName, s.googleLink)}>
                        {languageDeterminer(LANGUAGE.productViews.links)}
                      </span>

                      <Links
                        links={links}
                        boxStyles={s.linkBox}
                        linkStyles={s.link}
                      />

                      <span className={s.statName}>?</span>
                    </div>
                  )}
                </section>
              )}

              <section
                id="desktopDescription"
                className={s.finishDescriptionSection}
              />
            </div>
          </div>

          <section
            id="mobileDescription"
            className={s.startDescriptionSection}
          />
        </>
      )}

      {showModal && (
        <Modal
          product={product}
          mainImageIdx={mainImageIdx}
          closeModal={toggleModal}
        />
      )}

      {showConfirm && (
        <Confirm callBack={deleteProductHandler} closeConfirm={toggleConfirm} />
      )}
    </main>
  );
}

SpecificProductView.propTypes = {
  setProductsByTag: PropTypes.func.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
};
