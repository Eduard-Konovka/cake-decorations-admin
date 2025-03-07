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
  fetchCategories,
  fetchRemovedProducts,
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
import { languageWrapper, titleWrapper, descriptionWrapper } from 'middlewares';
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
    cart,
  } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [removedProduct, setRemovedProduct] = useState({});
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const productId = location.pathname.slice(17, location.pathname.length);
  const selectedProduct = cart.filter(
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
      fetchCategories()
        .then(categories => changeGlobalState(updateCategories, categories))
        .catch(error =>
          toast.error(
            `${languageDeterminer(
              LANGUAGE.toastErrors.gettingCategories,
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
              LANGUAGE.toastErrors.gettingTags,
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
              LANGUAGE.toastErrors.gettingLinks,
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
        getTags(titleWrapper(language, removedProduct), tagsDictionary, 'tags'),
      );
      setLinks(
        getTags(
          titleWrapper(language, removedProduct),
          linksDictionary,
          'links',
        ),
      );
    }
  }, [language, removedProduct, tagsDictionary, linksDictionary]);

  useEffect(() => {
    const description = document.querySelector('#description');
    description.innerHTML = descriptionWrapper(language, removedProduct);
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

    const duplicateImages = [];
    for (let i = 0; i < removedProduct.images.length; i++) {
      try {
        const file = await getFileFromUrl(
          removedProduct.images[i].url,
          `${Date.now().toString()}.jpg`,
        );

        const imageLink = await uploadImageToStorage(
          language,
          file,
          productTimeStamp,
        );

        duplicateImages.push({ id: imageLink.id, url: imageLink.url });
      } catch (error) {
        setLoading(false);
        toast.error(`Error of addImages(): ${error.message}`); // FIXME
        break;
      }
    }

    const newRemovedProduct = { ...removedProduct };
    newRemovedProduct.count = count;
    newRemovedProduct._id = Date.now().toString();

    addRemovedProductApi(
      newRemovedProduct,
      titleWrapper(language, newRemovedProduct),
    );

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
            // FIXME: change gettingProducts to gettingRemovedProducts
            LANGUAGE.toastErrors.gettingProducts,
          )}:\n${error}`,
        ),
      );
  };

  const restoreRemovedProductHandler = () => {
    setLoading(true);

    restoreRemovedProduct(
      removedProduct,
      titleWrapper(language, removedProduct),
      changeGlobalState,
      navigate,
    );
  };

  const deleteRemovedProductHandler = () => {
    setLoading(true);
    toggleConfirm();

    deleteRemovedProduct(
      removedProduct,
      titleWrapper(language, removedProduct),
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
              <img
                src={
                  removedProduct?.images?.length > 0
                    ? removedProduct.images[mainImageIdx].url
                    : imageNotFound
                }
                alt={titleWrapper(language, removedProduct)}
                className={s.mainImage}
                onClick={toggleModal}
              />

              {removedProduct?.images?.length > 1 && (
                <div className={s.additionalImagesBox}>
                  {removedProduct.images.map((imageObj, idx) => (
                    <img
                      key={imageObj.url}
                      src={imageObj.url}
                      alt={titleWrapper(language, removedProduct)}
                      className={s.additionalImage}
                      onClick={() => setMainImageIdx(idx)}
                    />
                  ))}
                </div>
              )}
            </section>

            <div className={s.thumb}>
              <div className={s.monitor}>
                <section className={s.statsSection}>
                  <h3 className={s.title}>
                    {titleWrapper(language, removedProduct)}
                  </h3>
                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(LANGUAGE.productViews.category)}
                    </span>
                    {getCategory(language, categories, removedProduct)}
                  </p>

                  {removedProduct?.product_details?.length > 0 &&
                    removedProduct.product_details.map(detail => (
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
