import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useChangeGlobalState, updateOrders } from 'state';
import { fetchCollection, acceptOrderApi } from 'api';
import { OrderedProduct } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import s from './Order.module.css';

export default function Order({ order }) {
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
        />
      ))}

      <div className={s.priceBox}>
        <p className={s.totalCost}>
          {languageDeterminer(LANGUAGE.orderBar.user)}
          {`${order.customer.firstName} ${order.customer.lastName}`}
        </p>

        <p className={s.totalCost}>
          {languageDeterminer(LANGUAGE.orderBar.totalCost)}
          {order.totalCost} ₴
        </p>

        <form className={s.bar}>
          <label htmlFor="orderType" className={s.typeLabel}>
            {languageDeterminer(LANGUAGE.orderBar.orderType.label)}
          </label>

          <select
            id="orderType"
            name="orderType"
            className={s.select}
            defaultValue={order.type}
            onChange={event => acceptOrderApi(order._id, event.target.value)}
          >
            <option
              title={languageDeterminer(
                LANGUAGE.orderBar.orderType.new.title.select,
              )}
              value={GLOBAL.ordersTypes.new}
            >
              {languageDeterminer(LANGUAGE.orderBar.orderType.new.text)}
            </option>

            <option
              title={languageDeterminer(
                LANGUAGE.orderBar.orderType.accepted.title.select,
              )}
              value={GLOBAL.ordersTypes.accepted}
            >
              {languageDeterminer(LANGUAGE.orderBar.orderType.accepted.text)}
            </option>

            <option
              title={languageDeterminer(
                LANGUAGE.orderBar.orderType.paid.title.select,
              )}
              value={GLOBAL.ordersTypes.paid}
            >
              {languageDeterminer(LANGUAGE.orderBar.orderType.paid.text)}
            </option>

            <option
              title={languageDeterminer(
                LANGUAGE.orderBar.orderType.shipped.title.select,
              )}
              value={GLOBAL.ordersTypes.shipped}
            >
              {languageDeterminer(LANGUAGE.orderBar.orderType.shipped.text)}
            </option>

            <option
              title={languageDeterminer(
                LANGUAGE.orderBar.orderType.rejected.title.select,
              )}
              value={GLOBAL.ordersTypes.rejected}
            >
              {languageDeterminer(LANGUAGE.orderBar.orderType.rejected.text)}
            </option>
          </select>
        </form>
      </div>
    </section>
  );
}

Order.propTypes = {
  order: PropTypes.object.isRequired,
};
