import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { fetchProduct } from 'api';
import { CountForm } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper, propertyWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './OrderedProduct.module.css';

const nonExistentProduct = {
  title: {
    ru: 'Несуществующий товар (возможно, он уже удалён)',
    ua: 'Неіснуючий товар (можливо, його вже видалено)',
    en: 'Non-existent product (maybe it was already deleted)',
  },
};

export default function OrderedProduct({ orderedProduct }) {
  const { _id, quantity } = orderedProduct;
  const { language } = useGlobalState('global');

  const [product, setProduct] = useState({});

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    fetchProduct(orderedProduct._id).then(product =>
      setProduct(product ?? nonExistentProduct),
    );
  }, [orderedProduct]);

  return (
    <article className={s.card}>
      <Link
        to={product?._id ? `/products/${_id}` : null}
        title={`${languageDeterminer(
          LANGUAGE.selectedProduct.titleLink,
        )} "${propertyWrapper(language, product, 'title')}"`}
        className={s.thumb}
        onClick={() =>
          !product?._id && toast.error('Цей товар зараз недоступний')
        } // FIXME
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
          <span className={s.priceValue}>{product?.price ?? 0} ₴</span>
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
          setCount={() => {}}
        />
      </div>
    </article>
  );
}

OrderedProduct.propTypes = {
  orderedProduct: PropTypes.object.isRequired,
};
