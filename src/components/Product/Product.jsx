import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './Product.module.css';

export default function Product({ product }) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <Link to={`/products/${product._id}`} className={s.btnLink}>
      <article>
        <img
          className={s.image}
          src={product?.images?.length > 0 ? product.images[0] : defaultImage}
          alt={product.title}
        />

        <div className={s.thumb}>
          <h3 className={s.title}>
            {product.title.length < GLOBAL.productView.titleLength
              ? product.title
              : product.title.slice(0, GLOBAL.productView.titleLength) + '...'}
          </h3>

          <p className={s.shortDescription}>
            {product.description.slice(
              0,
              GLOBAL.productView.titleLength *
                GLOBAL.productView.descriptionMultiplier,
            ) + '...'}
          </p>
        </div>

        <p className={s.paragraph_title}>
          {languageDeterminer(LANGUAGE.product.product_type)}
          <span className={s.value}>{product.product_type}</span>
        </p>

        <p className={s.paragraph_title}>
          {languageDeterminer(LANGUAGE.product.barcode)}
          <span className={s.value}>{product._id}</span>
        </p>

        <p className={s.paragraph_title}>
          {languageDeterminer(LANGUAGE.product.price)}
          <span className={s.value}>{product.price} ₴</span>
        </p>
      </article>
    </Link>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    product_type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
