import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { acceptOrderApi } from 'api';
import { OrderedProduct, Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import s from './Order.module.css';

export default function Order({ order }) {
  const [expandedList, setExpandedList] = useState(false);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const toggleList = () => setExpandedList(!expandedList);

  const getDelivery = () => {
    switch (order.customer.delivery) {
      case 'branch':
        return languageDeterminer(LANGUAGE.orderBar.deliveryValue.branch);

      case 'mailbox':
        return languageDeterminer(LANGUAGE.orderBar.deliveryValue.mailbox);

      case 'courier':
        return languageDeterminer(LANGUAGE.orderBar.deliveryValue.courier);

      default:
        break;
    }
  };

  return (
    <section>
      {order.cart.map(orderedProduct => (
        <OrderedProduct
          key={orderedProduct._id}
          orderedProduct={orderedProduct}
        />
      ))}

      <div className={s.statsBox}>
        <div className={s.statsFirstItem}>
          <Button
            title={languageDeterminer(
              LANGUAGE.productViews.cancelDeleteButton.title,
            )}
            styles={s.btn}
            onClick={toggleList}
          >
            {expandedList ? 'ᐱ' : 'ᐯ'}
          </Button>

          <div className={s.customerBox}>
            {!expandedList ? (
              <div className={s.row}>
                <p className={s.statsTitle}>
                  {languageDeterminer(LANGUAGE.orderBar.fullName)}
                </p>

                <p
                  className={s.statsDescription}
                >{`${order.customer.firstName} ${order.customer.lastName}`}</p>
              </div>
            ) : (
              <>
                <div className={s.row}>
                  <p className={s.statsTitle}>
                    {languageDeterminer(LANGUAGE.orderBar.fullName)}
                  </p>

                  <p className={s.statsDescription}>
                    {order.customer.firstName + ' ' + order.customer.lastName}
                  </p>
                </div>

                <div className={s.row}>
                  <p className={s.statsTitle}>
                    {languageDeterminer(LANGUAGE.orderBar.phone)}
                  </p>

                  <p className={s.statsDescription}>{order.customer.phone}</p>
                </div>

                <div className={s.row}>
                  <p className={s.statsTitle}>
                    {languageDeterminer(LANGUAGE.orderBar.locality)}
                  </p>

                  <p className={s.statsDescription}>
                    {order.customer.locality}
                  </p>
                </div>

                <div className={s.row}>
                  <p className={s.statsTitle}>
                    {languageDeterminer(LANGUAGE.orderBar.delivery)}
                  </p>

                  <p className={s.statsDescription}>{getDelivery()}</p>
                </div>

                <div className={s.row}>
                  <p className={s.statsTitle}>
                    {languageDeterminer(LANGUAGE.orderBar.address)}
                  </p>

                  <p className={s.statsDescription}>{order.customer.address}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={s.statsSecondItem}>
          <p className={s.statsTitle}>
            {languageDeterminer(LANGUAGE.orderBar.totalCost)}
          </p>

          <p className={s.statsDescription}>{order.totalCost} ₴</p>
        </div>

        <form className={s.statsThirdItem}>
          <label htmlFor="orderType" className={s.label}>
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
