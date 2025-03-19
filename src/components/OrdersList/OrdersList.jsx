import React from 'react';
import PropTypes from 'prop-types';
import { Order } from 'components';
import s from './OrdersList.module.css';

export default function OrdersList({ orders }) {
  return (
    <ul className={s.list}>
      {orders.map(item => (
        <li key={item._id} className={s.item}>
          <Order order={item} />
        </li>
      ))}
    </ul>
  );
}

OrdersList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
