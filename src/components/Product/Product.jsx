import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { getLanguage, getCategory } from 'functions';
import { languageWrapper, titleWrapper, descriptionWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './Product.module.css';

export default function Product({ product, productsType }) {
  const { language, categories } = useGlobalState('global');

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  function getPureText(string) {
    const pureString = string
      .replace(new RegExp('<[^>]*>', 'g'), '')
      .replace('&nbsp;', ' ')
      .replace('&ndash;', '–')
      .replace('&mdash;', '—')
      .replace('&plusmn;', '±')
      .replace('&lt;', '<')
      .replace('&gt;', '>')
      .replace('&#39;', "'")
      .replace('&quot;', '"')
      .replace('&ldquo;', '“')
      .replace('&rdquo;', '”')
      .replace('&laquo;', '«')
      .replace('&raquo;', '»')
      .replace('&lsquo;', '‘')
      .replace('&rsquo;', '’')
      .replace('&deg;', '°')
      .replace('&ordm;', 'º')
      .replace('&amp;', '&');

    const shortText =
      pureString.length <
      GLOBAL.productView.titleLength * GLOBAL.productView.descriptionMultiplier
        ? pureString
        : pureString.slice(
            0,
            GLOBAL.productView.titleLength *
              GLOBAL.productView.descriptionMultiplier,
          ) + '...';

    return shortText;
  }

  return (
    <article>
      <Link to={`/${productsType}/${product._id}`} className={s.btnLink}>
        <div className={s.imageBox}>
          <img
            className={s.image}
            src={
              product?.images?.length > 0 ? product.images[0].url : defaultImage
            }
            alt={titleWrapper(language, product)}
          />
        </div>

        <div className={s.thumb}>
          <h3 className={s.title}>
            {titleWrapper(language, product).length <
            GLOBAL.productView.titleLength
              ? titleWrapper(language, product)
              : titleWrapper(language, product).slice(
                  0,
                  GLOBAL.productView.titleLength,
                ) + '...'}
          </h3>

          <p className={s.shortDescription}>
            {getPureText(descriptionWrapper(language, product))}
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
        {languageDeterminer(LANGUAGE.product.creationDate)}
        <span className={s.value}>
          {Number(product._id) > 1735682400000
            ? new Date(Number(product._id)).toLocaleString()
            : '2024'}
        </span>
      </p>

      <div className={s.control}>
        <p className={s.paragraph_title}>
          {languageDeterminer(LANGUAGE.product.price)}
          <span className={s.value}>{product.price} ₴</span>
        </p>
      </div>
    </article>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.objectOf(PropTypes.string).isRequired,
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  }).isRequired,
};
