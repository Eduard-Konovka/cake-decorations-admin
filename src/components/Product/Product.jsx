import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import Button from 'components/Button';
import { getLanguage, getCategory } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './Product.module.css';

export default function Product({ product, addToCart }) {
  const { language, categories } = useGlobalState('global');

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <article>
      <Link to={`/products/${product._id}`} className={s.btnLink}>
        <div className={s.imageBox}>
          <img
            className={s.image}
            src={product?.images?.length > 0 ? product.images[0] : defaultImage}
            alt={language === 'RU' ? product.ruTitle : product.uaTitle}
          />
        </div>

        <div className={s.thumb}>
          <h3 className={s.title}>
            {language === 'RU'
              ? product.ruTitle.length < GLOBAL.productView.titleLength
                ? product.ruTitle
                : product.ruTitle.slice(0, GLOBAL.productView.titleLength) +
                  '...'
              : product.uaTitle.length < GLOBAL.productView.titleLength
              ? product.uaTitle
              : product.uaTitle.slice(0, GLOBAL.productView.titleLength) +
                '...'}
          </h3>

          <p className={s.shortDescription}>
            {language === 'RU'
              ? product.ruDescription.slice(
                  0,
                  GLOBAL.productView.titleLength *
                    GLOBAL.productView.descriptionMultiplier,
                ) + '...'
              : product.uaDescription.slice(
                  0,
                  GLOBAL.productView.titleLength *
                    GLOBAL.productView.descriptionMultiplier,
                ) + '...'}
          </p>
        </div>
      </Link>

      <p className={s.paragraph_title}>
        {languageDeterminer(LANGUAGE.product.category)}
        <span className={s.value}>
          {getCategory(language, categories, product)}
        </span>
      </p>

      <p className={s.paragraph_title}>
        {languageDeterminer(LANGUAGE.product.barcode)}
        <span className={s.value}>{product._id}</span>
      </p>

      <div className={s.control}>
        <p className={s.paragraph_title}>
          {languageDeterminer(LANGUAGE.product.price)}
          <span className={s.value}>{product.price} ₴</span>
        </p>

        <Button
          title={languageDeterminer(LANGUAGE.product.button.title)}
          type="button"
          onClick={() => addToCart({ ...product, count: 1 })}
        >
          {languageDeterminer(LANGUAGE.product.button.text)}
        </Button>
      </div>
    </article>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    uaTitle: PropTypes.string.isRequired,
    ruTitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    uaDescription: PropTypes.string.isRequired,
    ruDescription: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};
