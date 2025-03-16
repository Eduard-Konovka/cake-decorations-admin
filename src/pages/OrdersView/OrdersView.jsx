import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState, updateOrders } from 'state';
import { fetchCollection } from 'api';
import { Spinner, Button, Blank, OrdersList } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import imageBlank from 'assets/empty-trash-bin.png';
import s from './OrdersView.module.css';

export default function OrdersView({ changeSelectCount, onDeleteProduct }) {
  const { mainHeight, orders } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordersType, setOrdersType] = useState('new');
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
    const newOrders = orders.filter(order => order?.type === 'new');
    const acceptedOrders = orders.filter(order => order?.type === 'accepted');
    const paidOrders = orders.filter(order => order?.type === 'paid');
    const shippedOrders = orders.filter(order => order?.type === 'shipped');
    const canceledOrders = orders.filter(order => order?.type === 'canceled');

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
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'new'}
                styles={s.btn}
                onClick={() => setOrdersType('new')}
              >
                {'Нові'}
              </Button>

              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'accepted'}
                styles={s.btn}
                onClick={() => setOrdersType('accepted')}
              >
                {'Прийняті'}
              </Button>

              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'paid'}
                styles={s.btn}
                onClick={() => setOrdersType('paid')}
              >
                {'Оплачені'}
              </Button>

              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'shipped'}
                styles={s.btn}
                onClick={() => setOrdersType('shipped')}
              >
                {'Відправлені'}
              </Button>

              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'canceled'}
                styles={s.btn}
                onClick={() => setOrdersType('canceled')}
              >
                {'Скасовані'}
              </Button>

              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'all'}
                styles={s.btn}
                onClick={() => setOrdersType('all')}
              >
                {'Всі'}
              </Button>
            </div>
          </section>

          {ordersType === 'new' ? (
            newOrders.length > 0 ? (
              <OrdersList
                orders={newOrders}
                changeSelectCount={changeSelectCount}
                onDeleteProduct={onDeleteProduct}
              />
            ) : (
              <Blank
                title={'Немає нових замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === 'accepted' ? (
            acceptedOrders.length > 0 ? (
              <OrdersList
                orders={acceptedOrders}
                changeSelectCount={changeSelectCount}
                onDeleteProduct={onDeleteProduct}
              />
            ) : (
              <Blank
                title={'Немає прийнятих замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === 'paid' ? (
            paidOrders.length > 0 ? (
              <OrdersList
                orders={paidOrders}
                changeSelectCount={changeSelectCount}
                onDeleteProduct={onDeleteProduct}
              />
            ) : (
              <Blank
                title={'Немає оплачених замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === 'shipped' ? (
            shippedOrders.length > 0 ? (
              <OrdersList
                orders={shippedOrders}
                changeSelectCount={changeSelectCount}
                onDeleteProduct={onDeleteProduct}
              />
            ) : (
              <Blank
                title={'Немає відправлених замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === 'canceled' ? (
            canceledOrders.length > 0 ? (
              <OrdersList
                orders={canceledOrders}
                changeSelectCount={changeSelectCount}
                onDeleteProduct={onDeleteProduct}
              />
            ) : (
              <Blank
                title={'Немає скасованих замовлень'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : orders.length > 0 ? (
            <OrdersList
              orders={orders}
              changeSelectCount={changeSelectCount}
              onDeleteProduct={onDeleteProduct}
            />
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
