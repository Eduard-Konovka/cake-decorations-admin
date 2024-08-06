import React from 'react';
import PropTypes from 'prop-types';
import SelectedProduct from 'components/SelectedProduct';
import s from './CartList.module.css';

export default function CartList({ cart, changeSelectCount, onDeleteProduct }) {
  return (
    <ul className={s.list}>
      {cart.map(item => (
        <li key={item._id} className={s.item}>
          <SelectedProduct
            selectedProduct={item}
            changeSelectCount={changeSelectCount}
            onDeleteProduct={() => onDeleteProduct(item._id)}
          />
        </li>
      ))}
    </ul>
  );
}

CartList.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
