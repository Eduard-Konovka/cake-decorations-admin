import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { fetchProduct } from 'api';
import { CountForm, Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper, propertyWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './OrderedProduct.module.css';

export default function OrderedProduct({
  orderedProduct,
  changeSelectCount,
  onDeleteProduct,
}) {
  const { _id, quantity } = orderedProduct;
  const { language } = useGlobalState('global');

  const [product, setProduct] = useState({});

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    fetchProduct(orderedProduct._id).then(product => setProduct(product));
  }, [orderedProduct]);

  return (
    <article className={s.card}>
      <Link
        to={`/products/${_id}`}
        title={`${languageDeterminer(
          LANGUAGE.selectedProduct.titleLink,
        )} "${propertyWrapper(language, product, 'title')}"`}
        className={s.thumb}
      >
        <img
          src={
            product?.images?.length > 0 ? product.images[0].url : defaultImage
          }
          alt={propertyWrapper(language, product, 'title')}
          className={s.image}
        />

        <h3 className={s.title}>
          {propertyWrapper(language, product, 'title').length <
          GLOBAL.productView.titleLength
            ? propertyWrapper(language, product, 'title')
            : propertyWrapper(language, product, 'title').slice(
                0,
                GLOBAL.productView.titleLength,
              ) + '...'}
        </h3>
      </Link>

      <div className={s.controls}>
        <p className={s.price}>
          <span className={s.priceTitle}>
            {languageDeterminer(LANGUAGE.selectedProduct.price)}
          </span>
          <span className={s.priceValue}>{product.price} ₴</span>
        </p>

        <CountForm
          value={quantity}
          min={GLOBAL.productCount.min}
          max={GLOBAL.productCount.max}
          styles={{
            formStyle: s.countForm,
            labelStyle: s.countLabel,
            inputStyle: s.countInput,
          }}
          setCount={count => changeSelectCount({ count, _id })}
        />

        <Button
          title={languageDeterminer(LANGUAGE.selectedProduct.buttonTitle)}
          type="button"
          styles={s.btn}
          onClick={onDeleteProduct}
        >
          {languageDeterminer(LANGUAGE.selectedProduct.buttonText)}
        </Button>
      </div>
    </article>
  );
}

OrderedProduct.propTypes = {
  orderedProduct: PropTypes.object.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
