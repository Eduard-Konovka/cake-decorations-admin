import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  updateCategories,
  updateRemovedProducts,
  updateTagsDictionary,
  updateLinksDictionary,
} from 'state';
import {
  fetchCollection,
  fetchRemovedProduct,
  fetchTags,
  fetchLinks,
  addRemovedProductApi,
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
  restoreRemovedProduct,
  deleteRemovedProduct,
  getFileFromUrl,
  uploadImageToStorage,
} from 'functions';
import { languageWrapper, propertyWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import s from './RemovedSpecificProductView.module.css';

export default function RemovedSpecificProductView({
  setProductsByTag,
  changeSelectCount,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mainHeight,
    language,
    categories,
    removedProducts,
    tagsDictionary,
    linksDictionary,
    orders,
  } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [removedProduct, setRemovedProduct] = useState(null);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const productId = location.pathname.slice(17, location.pathname.length);
  const selectedProduct = orders.filter(
    removedProduct => removedProduct._id === productId,
  )[0];
  const savedProduct = removedProducts.filter(
    removedProduct => removedProduct._id === productId,
  )[0];

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
    if (removedProducts.length > 0) {
      setRemovedProduct(savedProduct);
    } else {
      setLoading(true);

      fetchRemovedProduct(productId)
        .then(removedProduct => setRemovedProduct(removedProduct))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
  }, [productId, removedProducts.length, savedProduct]);

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
      removedProduct?.title?.['ua' || 'ru' || 'en'] &&
      tagsDictionary &&
      linksDictionary
    ) {
      setTags(
        getTags(
          propertyWrapper(language, removedProduct, 'title'),
          tagsDictionary,
          'tags',
        ),
      );
      setLinks(
        getTags(
          propertyWrapper(language, removedProduct, 'title'),
          linksDictionary,
          'links',
        ),
      );
    }
  }, [language, removedProduct, tagsDictionary, linksDictionary]);

  useEffect(() => {
    if (!removedProduct) return;
    const description = document.querySelector('#description');
    if (description) {
      description.innerHTML = propertyWrapper(
        language,
        removedProduct,
        'description',
      );
    }
  }, [language, removedProduct]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
  };

  const editRemovedProductHandler = () => {
    navigate(`/removedProducts/edit/${productId}`);
  };

  const duplicateRemovedProductHandler = async () => {
    setLoading(true);

    const productTimeStamp = Date.now().toString();

    const newImages = [];
    for (let i = 0; i < removedProduct.images.length; i++) {
      try {
        const file = await getFileFromUrl(
          removedProduct.images[i].url,
          `${Date.now().toString()}.jpg`,
        );

        const newImage = await uploadImageToStorage(
          language,
          { file, type: removedProduct.images[i]?.type || 'image' },
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

    const newRemovedProduct = { ...removedProduct };
    newRemovedProduct._id = productTimeStamp;
    newRemovedProduct.count = count;
    newRemovedProduct.images = newImages;

    addRemovedProductApi(
      newRemovedProduct,
      propertyWrapper(language, newRemovedProduct, 'title'),
    );

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
            // FIXME: change productsGetting to removedProductsGetting
            LANGUAGE.toastErrors.productsGetting,
          )}:\n${error}`,
        ),
      );
  };

  const restoreRemovedProductHandler = () => {
    setLoading(true);

    restoreRemovedProduct(
      removedProduct,
      propertyWrapper(language, removedProduct, 'title'),
      changeGlobalState,
      navigate,
    );
  };

  const deleteRemovedProductHandler = () => {
    setLoading(true);
    toggleConfirm();

    deleteRemovedProduct(
      removedProduct,
      propertyWrapper(language, removedProduct, 'title'),
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

      {!loading && !error && removedProduct && (
        <>
          <div className={s.row}>
            <section className={s.imagesSection}>
              {removedProduct.images[mainImageIdx]?.type === 'video' ? (
                <video
                  src={removedProduct.images[mainImageIdx].url}
                  title={'Збільшити'} // FIXME
                  className={s.mainImage}
                  onClick={toggleModal}
                />
              ) : (
                <img
                  src={
                    removedProduct?.images?.length > 0
                      ? removedProduct.images[mainImageIdx].url
                      : imageNotFound
                  }
                  title={'Збільшити'} // FIXME
                  alt={propertyWrapper(language, removedProduct, 'title')}
                  draggable="false"
                  className={s.mainImage}
                  onClick={toggleModal}
                />
              )}

              {removedProduct?.images?.length > 1 && (
                <div className={s.additionalImagesBox}>
                  {removedProduct.images.map((imageObj, idx) =>
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
                        alt={propertyWrapper(language, removedProduct, 'title')}
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
                    {propertyWrapper(language, removedProduct, 'title')}
                  </h3>
                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(LANGUAGE.productViews.category)}
                    </span>
                    {getCategory(language, categories, removedProduct)}
                  </p>

                  {removedProduct?.product_details?.['ua' || 'ru' || 'en']
                    ?.length > 0 &&
                    propertyWrapper(
                      language,
                      removedProduct,
                      'product_details',
                    ).map(detail => (
                      <p key={detail.attribute_name} className={s.stat}>
                        <span className={s.statName}>
                          {detail.attribute_name}:
                        </span>
                        {detail.attribute_value}
                      </p>
                    ))}
                </section>

                <section className={s.controlsSection}>
                  <p className={s.count}>
                    <span className={s.boldfont}>
                      {languageDeterminer(LANGUAGE.productViews.price)}
                    </span>
                    {removedProduct.price} ₴
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
                      onClick={editRemovedProductHandler}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.editButton.text,
                      )}
                    </Button>

                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.duplicateButton.removedTitle,
                      )}
                      type="button"
                      styles={s.btn}
                      onClick={duplicateRemovedProductHandler}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.duplicateButton.text,
                      )}
                    </Button>

                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.restoreButton.title,
                      )}
                      type="button"
                      styles={s.btn}
                      onClick={restoreRemovedProductHandler}
                    >
                      {languageDeterminer(
                        LANGUAGE.productViews.restoreButton.text,
                      )}
                    </Button>

                    <Button
                      title={languageDeterminer(
                        LANGUAGE.productViews.deleteButton.removedTitle,
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
                id="description"
                className={s.finishDescriptionSection}
              />
            </div>
          </div>

          <section id="description" className={s.startDescriptionSection} />
        </>
      )}

      {showModal && (
        <Modal
          product={removedProduct}
          mainImageIdx={mainImageIdx}
          closeModal={toggleModal}
        />
      )}

      {showConfirm && (
        <Confirm
          callBack={deleteRemovedProductHandler}
          closeConfirm={toggleConfirm}
        />
      )}
    </main>
  );
}

RemovedSpecificProductView.propTypes = {
  setProductsByTag: PropTypes.func.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
};
