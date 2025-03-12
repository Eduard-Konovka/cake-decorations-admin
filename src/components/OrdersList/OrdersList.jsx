import React from 'react';
import PropTypes from 'prop-types';
import { Order } from 'components';
import s from './OrdersList.module.css';

export default function OrdersList({
  orders,
  changeSelectCount,
  onDeleteProduct,
}) {
  return (
    <div className={s.bar}>
      <ul className={s.list}>
        {orders.map(item => (
          <li key={item._id} className={s.item}>
            <Order
              order={item}
              changeSelectCount={changeSelectCount}
              onDeleteProduct={() => onDeleteProduct(item._id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

OrdersList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
