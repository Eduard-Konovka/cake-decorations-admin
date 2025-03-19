import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState, updateOrders } from 'state';
import { fetchCollection } from 'api';
import { Spinner, Button, Blank, OrdersList } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import imageBlank from 'assets/empty-trash-bin.png';
import s from './OrdersView.module.css';

export default function OrdersView({ changeSelectCount, onDeleteProduct }) {
  const { mainHeight, orders } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordersType, setOrdersType] = useState(GLOBAL.ordersTypes.new);
  const [newOrders, setNewOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [shippedOrders, setShippedOrders] = useState([]);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  useEffect(() => {
    setLoading(true);

    fetchCollection('orders')
      .then(orders => {
        orders.sort(
          (firstProduct, secondProduct) => secondProduct._id - firstProduct._id,
        );
        changeGlobalState(updateOrders, orders);
      })
      .catch(error => setError(error))
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newOrders = orders.filter(
      order => order?.type === GLOBAL.ordersTypes.new,
    );
    const acceptedOrders = orders.filter(
      order => order?.type === GLOBAL.ordersTypes.accepted,
    );
    const paidOrders = orders.filter(
      order => order?.type === GLOBAL.ordersTypes.paid,
    );
    const shippedOrders = orders.filter(
      order => order?.type === GLOBAL.ordersTypes.shipped,
    );
    const canceledOrders = orders.filter(
      order => order?.type === GLOBAL.ordersTypes.rejected,
    );

    setNewOrders(newOrders);
    setAcceptedOrders(acceptedOrders);
    setPaidOrders(paidOrders);
    setShippedOrders(shippedOrders);
    setCanceledOrders(canceledOrders);
  }, [orders]);

  return (
    <main
      className={orders.length > 0 ? s.page : s.blank}
      style={{ minHeight: mainHeight }}
    >
      {loading ? (
        <Spinner size={70} color="red" />
      ) : error ? (
        <div className={s.errorBox}>
          <p className={s.errorLabel}>
            {languageDeterminer(LANGUAGE.viewError)}
          </p>
          <p className={s.errorText}>{error.message}</p>
        </div>
      ) : (
        <>
          <section className={s.bar}>
            <div className={s.btnBox}>
              <Button
                title={languageDeterminer(
                  LANGUAGE.orderBar.orderType.new.title.button,
                )}
                type="button"
                disabled={ordersType === GLOBAL.ordersTypes.new}
                styles={s.btn}
                onClick={() => setOrdersType(GLOBAL.ordersTypes.new)}
              >
                {languageDeterminer(LANGUAGE.orderBar.orderType.new.text)}
              </Button>

              <Button
                title={languageDeterminer(
                  LANGUAGE.orderBar.orderType.accepted.title.button,
                )}
                type="button"
                disabled={ordersType === GLOBAL.ordersTypes.accepted}
                styles={s.btn}
                onClick={() => setOrdersType(GLOBAL.ordersTypes.accepted)}
              >
                {languageDeterminer(LANGUAGE.orderBar.orderType.accepted.text)}
              </Button>

              <Button
                title={languageDeterminer(
                  LANGUAGE.orderBar.orderType.paid.title.button,
                )}
                type="button"
                disabled={ordersType === GLOBAL.ordersTypes.paid}
                styles={s.btn}
                onClick={() => setOrdersType(GLOBAL.ordersTypes.paid)}
              >
                {languageDeterminer(LANGUAGE.orderBar.orderType.paid.text)}
              </Button>

              <Button
                title={languageDeterminer(
                  LANGUAGE.orderBar.orderType.shipped.title.button,
                )}
                type="button"
                disabled={ordersType === GLOBAL.ordersTypes.shipped}
                styles={s.btn}
                onClick={() => setOrdersType(GLOBAL.ordersTypes.shipped)}
              >
                {languageDeterminer(LANGUAGE.orderBar.orderType.shipped.text)}
              </Button>

              <Button
                title={languageDeterminer(
                  LANGUAGE.orderBar.orderType.rejected.title.button,
                )}
                type="button"
                disabled={ordersType === GLOBAL.ordersTypes.rejected}
                styles={s.btn}
                onClick={() => setOrdersType(GLOBAL.ordersTypes.rejected)}
              >
                {languageDeterminer(LANGUAGE.orderBar.orderType.rejected.text)}
              </Button>

              <Button
                title={languageDeterminer(
                  LANGUAGE.orderBar.orderType.all.title.button,
                )}
                type="button"
                disabled={ordersType === 'all'}
                styles={s.btn}
                onClick={() => setOrdersType('all')}
              >
                {languageDeterminer(LANGUAGE.orderBar.orderType.all.text)}
              </Button>
            </div>
          </section>

          {ordersType === GLOBAL.ordersTypes.new ? (
            newOrders.length > 0 ? (
              <OrdersList orders={newOrders} />
            ) : (
              <Blank
                title={'Немає нових замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === GLOBAL.ordersTypes.accepted ? (
            acceptedOrders.length > 0 ? (
              <OrdersList orders={acceptedOrders} />
            ) : (
              <Blank
                title={'Немає прийнятих замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === GLOBAL.ordersTypes.paid ? (
            paidOrders.length > 0 ? (
              <OrdersList orders={paidOrders} />
            ) : (
              <Blank
                title={'Немає оплачених замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === GLOBAL.ordersTypes.shipped ? (
            shippedOrders.length > 0 ? (
              <OrdersList orders={shippedOrders} />
            ) : (
              <Blank
                title={'Немає відправлених замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === GLOBAL.ordersTypes.rejected ? (
            canceledOrders.length > 0 ? (
              <OrdersList orders={canceledOrders} />
            ) : (
              <Blank
                title={'Немає скасованих замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : orders.length > 0 ? (
            <OrdersList orders={orders} />
          ) : (
            <Blank
              title={'Немає замовлень'}
              image={imageBlank}
              alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
            />
          )}
        </>
      )}
    </main>
  );
}

OrdersView.propTypes = {
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
