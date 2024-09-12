import React from 'react';
import PropTypes from 'prop-types';
import Category from 'components/Category';
import allProducts from 'assets/shop.jpg';
import s from './CategoriesList.module.css';

const ALL_PRODUCTS = {
  _id: 'allProducts',
  title: 'Всі категорії',
  titleRu: 'Все категории',
  image: allProducts,
};

export default function CategoriesList({ categories, setProductsByCategory }) {
  return (
    <ul className={s.list}>
      {categories.map(item => (
        <li key={item._id} className={s.item}>
          <Category
            category={item}
            setProductsByCategory={setProductsByCategory}
          />
        </li>
      ))}

      <li key={ALL_PRODUCTS._id} className={s.item}>
        <Category
          category={ALL_PRODUCTS}
          setProductsByCategory={setProductsByCategory}
        />
      </li>
    </ul>
  );
}

CategoriesList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setProductsByCategory: PropTypes.func.isRequired,
};
