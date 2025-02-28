import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  updateCategories,
  updateTagsDictionary,
  updateLinksDictionary,
} from 'state';
import {
  fetchCategories,
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
} from 'functions';
import { languageWrapper, titleWrapper, descriptionWrapper } from 'middlewares';
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
    cart,
  } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({});
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const productId = location.pathname.slice(10, location.pathname.length);
  const selectedProduct = cart.filter(product => product._id === productId)[0];
  const savedProduct = products.filter(product => product._id === productId)[0];

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
      (product.uaTitle || // FIXME
        product.ruTitle ||
        product.enTitle ||
        product.title) &&
      tagsDictionary &&
      linksDictionary
    ) {
      setTags(getTags(titleWrapper(language, product), tagsDictionary, 'tags'));
      setLinks(
        getTags(titleWrapper(language, product), linksDictionary, 'links'),
      );
    }
  }, [language, product, tagsDictionary, linksDictionary]);

  useEffect(() => {
    const description = document.querySelector('#description');
    description.innerHTML = descriptionWrapper(language, product);
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

  const duplicateProductHandler = () => {
    setLoading(true);

    // FIXME: duplicate images to new product

    const newProduct = { ...product };
    newProduct.count = count;
    newProduct._id = Date.now().toString();

    addProductApi(newProduct, titleWrapper(language, newProduct));
  };

  const deleteProductHandler = () => {
    setLoading(true);
    toggleConfirm();

    deleteProduct(
      product,
      titleWrapper(language, product),
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
              <img
                src={
                  product?.images?.length > 0
                    ? product.images[mainImageIdx]
                    : imageNotFound
                }
                alt={titleWrapper(language, product)}
                className={s.mainImage}
                onClick={toggleModal}
              />

              {product?.images?.length > 1 && (
                <div className={s.additionalImagesBox}>
                  {product.images.map((imageLink, idx) => (
                    <img
                      key={imageLink}
                      src={imageLink}
                      alt={titleWrapper(language, product)}
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
                  <h3 className={s.title}>{titleWrapper(language, product)}</h3>
                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(LANGUAGE.productViews.category)}
                    </span>
                    {getCategory(language, categories, product)}
                  </p>

                  {product?.product_details?.length > 0 &&
                    product.product_details.map(detail => (
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
