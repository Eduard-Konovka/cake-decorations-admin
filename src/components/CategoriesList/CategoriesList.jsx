import React from 'react';
import PropTypes from 'prop-types';
import Category from 'components/Category';
import s from './CategoriesList.module.css';

export default function CategoriesList({ categories }) {
  return (
    <ul className={s.list}>
      {categories.map(item => (
        <li key={item._id} className={s.item}>
          <Category category={item} />
        </li>
      ))}
    </ul>
  );
}

CategoriesList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
