import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { fetchProduct } from 'api';
import { Spinner, Button, Tags, Links, CountForm, Modal } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageNotFound from 'assets/notFound.png';
import s from './SpecificProductView.module.css';

export default function SpecificProductView({
  setProductsByTag,
  changeSelectCount,
  addToCart,
}) {
  const location = useLocation();
  const { mainHeight, products, cart } = useGlobalState('global');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({});
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const productId = location.pathname.slice(10, location.pathname.length);
  const selectedProduct = cart.filter(product => product._id === productId)[0];
  const savedProduct = products.filter(product => product._id === productId)[0];

  const [count, setCount] = useState(
    selectedProduct ? selectedProduct.count : 0,
  );

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

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

  const toggleModal = () => {
    setShowModal(!showModal);
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
            <div className={s.imagesBox}>
              <img
                src={
                  product?.images?.length > 0
                    ? product.images[mainImageIdx]
                    : imageNotFound
                }
                alt={product.title}
                className={s.mainImage}
                onClick={toggleModal}
              />

              {product?.images?.length > 1 && (
                <div className={s.additionalImagesBox}>
                  {product.images.map((imageLink, idx) => (
                    <img
                      key={imageLink}
                      src={imageLink}
                      alt={product.title}
                      className={s.additionalImage}
                      onClick={() => setMainImageIdx(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className={s.thumb}>
              <div className={s.monitor}>
                <div className={s.stats}>
                  <h3 className={s.title}>{product.title}</h3>
                  <p className={s.stat}>
                    <span className={s.statName}>
                      {languageDeterminer(
                        LANGUAGE.specificProductView.product_type,
                      )}
                    </span>
                    {product.product_type}
                  </p>

                  {product.product_details &&
                    product.product_details.map(detail => (
                      <p key={detail.attribute_name} className={s.stat}>
                        <span className={s.statName}>
                          {detail.attribute_name}:
                        </span>
                        {detail.attribute_value}
                      </p>
                    ))}
                </div>

                <div className={s.controls}>
                  <p className={s.count}>
                    <span className={s.boldfont}>
                      {languageDeterminer(LANGUAGE.specificProductView.price)}
                    </span>
                    {product.price} ₴
                  </p>

                  <CountForm
                    value={count}
                    price={product.price}
                    min={GLOBAL.productCount.min}
                    max={GLOBAL.productCount.max}
                    styles={{
                      formStyle: s.count,
                      labelStyle: s.boldfont,
                      inputStyle: s.input,
                      spanStyle: s.boldfont,
                      totalPriceStyle: s.count,
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

                  <div>
                    <Button
                      title={languageDeterminer(
                        LANGUAGE.specificProductView.buttonTitle,
                      )}
                      type="button"
                      disabled={!count}
                      styles={s.btn}
                      onClick={() =>
                        addToCart({ ...product, count: Number(count) })
                      }
                    >
                      {languageDeterminer(
                        LANGUAGE.specificProductView.buttonText,
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className={s.links}>
                <div className={s.linksBox}>
                  <span className={s.statName}>
                    {languageDeterminer(LANGUAGE.specificProductView.tags)}
                  </span>
                  {product.title && (
                    <Tags
                      title={product.title}
                      boxStyles={s.tagBox}
                      tagStyles={s.tag}
                      setProductsByTag={setProductsByTag}
                    />
                  )}
                </div>

                <div className={s.linksBox}>
                  <div className={classNames(s.statName, s.googleLink)}>
                    {languageDeterminer(LANGUAGE.specificProductView.links)}
                  </div>
                  {product.title && (
                    <Links
                      title={product.title}
                      boxStyles={s.linkBox}
                      linkStyles={s.link}
                    />
                  )}
                  <div className={s.statName}>{'?'}</div>
                </div>
              </div>

              <p className={s.finishDescription}>{product.description}</p>
            </div>
          </div>

          <p className={s.startDescription}>{product.description}</p>
        </>
      )}

      {showModal && (
        <Modal
          product={product}
          mainImageIdx={mainImageIdx}
          closeModal={toggleModal}
        />
      )}
    </main>
  );
}

SpecificProductView.propTypes = {
  setProductsByTag: PropTypes.func.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
};
