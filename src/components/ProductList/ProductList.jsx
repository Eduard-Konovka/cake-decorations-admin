import React from 'react';
import PropTypes from 'prop-types';
import Product from 'components/Product';
import s from './ProductList.module.css';

export default function ProductList({
  products,
  productsType = 'products',
  specificCategory = false,
}) {
  return (
    <ul id="productList" className={s.list}>
      {products.map(item => (
        <li key={item._id} className={s.item}>
          <Product
            product={item}
            productsType={productsType}
            specificCategory={specificCategory}
          />
        </li>
      ))}
    </ul>
  );
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  productsType: PropTypes.string,
  specificCategory: PropTypes.bool,
};
