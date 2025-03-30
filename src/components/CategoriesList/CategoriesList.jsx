import React from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import Category from 'components/Category';
import allProducts from 'assets/shop.jpg';
import s from './CategoriesList.module.css';

const ALL_PRODUCTS = {
  _id: 'allProducts',
  title: {
    ua: 'Всі товари',
    ru: 'Все товары',
    en: 'All products',
  },
  image: allProducts,
};

export default function CategoriesList({ setProductsByCategory }) {
  const { categories } = useGlobalState('global');

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
  setProductsByCategory: PropTypes.func.isRequired,
};
