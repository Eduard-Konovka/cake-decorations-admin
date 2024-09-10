import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './Category.module.css';

export default function Category({ category }) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <Link to={`/products/${category._id}`} className={s.btnLink}>
      <article>
        <img
          className={s.image}
          src={category?.images?.length > 0 ? category.images[0] : defaultImage}
          alt={category.title}
        />

        <div className={s.thumb}>
          <h3 className={s.title}>
            {category.title.length < GLOBAL.productView.titleLength
              ? category.title
              : category.title.slice(0, GLOBAL.productView.titleLength) + '...'}
          </h3>

          <p className={s.shortDescription}>
            {category.description.slice(
              0,
              GLOBAL.productView.titleLength *
                GLOBAL.productView.descriptionMultiplier,
            ) + '...'}
          </p>
        </div>

        <p className={s.paragraph_title}>
          {languageDeterminer(LANGUAGE.product.product_type)}
          <span className={s.value}>{category.product_type}</span>
        </p>

        <p className={s.paragraph_title}>
          {languageDeterminer(LANGUAGE.product.barcode)}
          <span className={s.value}>{category._id}</span>
        </p>

        <p className={s.paragraph_title}>
          {languageDeterminer(LANGUAGE.product.price)}
          <span className={s.value}>{category.price} ₴</span>
        </p>
      </article>
    </Link>
  );
}

Category.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    product_type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
