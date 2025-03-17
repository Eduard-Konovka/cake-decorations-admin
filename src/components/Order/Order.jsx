import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useChangeGlobalState, updateOrders } from 'state';
import { fetchCollection, acceptOrderApi } from 'api';
import { OrderedProduct, Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './Order.module.css';

export default function Order({ order, changeSelectCount, onDeleteProduct }) {
  const changeGlobalState = useChangeGlobalState();

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    fetchCollection('orders').then(orders => {
      orders.sort(
        (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
      );
      changeGlobalState(updateOrders, orders);
    });
  }, [changeGlobalState]);

  return (
    <section>
      {order.cart.map(orderedProduct => (
        <OrderedProduct
          key={orderedProduct._id}
          orderedProduct={orderedProduct}
          changeSelectCount={changeSelectCount}
          onDeleteProduct={onDeleteProduct}
        />
      ))}

      <div className={s.priceBox}>
        <p className={s.totalCost}>
          {languageDeterminer(LANGUAGE.orderBar.user)}
          {order.user.name}
        </p>

        <p className={s.totalCost}>
          {languageDeterminer(LANGUAGE.orderBar.totalCost)}
          {order.totalCost} ₴
        </p>

        {order.type !== 'rejected' && (
          <Button
            title={languageDeterminer(LANGUAGE.orderBar.rejectButton.title)}
            type="button"
            styles={s.btn}
            onClick={() => acceptOrderApi(order._id, 'rejected')}
          >
            {languageDeterminer(LANGUAGE.orderBar.rejectButton.text)}
          </Button>
        )}

        {order.type !== 'accepted' && (
          <Button
            title={languageDeterminer(LANGUAGE.orderBar.acceptButton.title)}
            type="button"
            styles={s.btn}
            onClick={() => acceptOrderApi(order._id, 'accepted')}
          >
            {languageDeterminer(LANGUAGE.orderBar.acceptButton.text)}
          </Button>
        )}
      </div>
    </section>
  );
}

Order.propTypes = {
  order: PropTypes.object.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
