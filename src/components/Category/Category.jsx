import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { GLOBAL } from 'constants';
import defaultImage from 'assets/notFound.png';
import s from './Category.module.css';

export default function Category({ category }) {
  return (
    <Link to={`/products`} className={s.btnLink}>
      <article>
        <img
          className={s.image}
          src={category.image ?? defaultImage}
          alt={category.title}
        />

        <div className={s.thumb}>
          <h3 className={s.title}>
            {category.title.length < GLOBAL.productView.titleLength
              ? category.title
              : category.title.slice(0, GLOBAL.productView.titleLength) + '...'}
          </h3>

          <p className={s.shortDescription}>
            {category.titleRu.slice(
              0,
              GLOBAL.productView.titleLength *
                GLOBAL.productView.descriptionMultiplier,
            ) + '...'}
          </p>
        </div>
      </article>
    </Link>
  );
}

Category.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleRu: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};
