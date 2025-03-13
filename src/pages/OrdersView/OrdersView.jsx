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
  const [processingOrders, setProcessingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);

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
    const processingOrders = orders.filter(
      order => order?.type === 'processing',
    );
    const readyOrders = orders.filter(order => order?.type === 'ready');

    setNewOrders(newOrders);
    setProcessingOrders(processingOrders);
    setReadyOrders(readyOrders);
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
                {'Нові замовлення'}
              </Button>

              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'processing'}
                styles={s.btn}
                onClick={() => setOrdersType('processing')}
              >
                {'В обробці'}
              </Button>

              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'ready'}
                styles={s.btn}
                onClick={() => setOrdersType('ready')}
              >
                {'Виконані замовлення'}
              </Button>

              <Button
                title={languageDeterminer(LANGUAGE.addProductButton.title)}
                type="button"
                disabled={ordersType === 'all'}
                styles={s.btn}
                onClick={() => setOrdersType('all')}
              >
                {'Всі замовлення'}
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
          ) : ordersType === 'processing' ? (
            processingOrders.length > 0 ? (
              <OrdersList
                orders={processingOrders}
                changeSelectCount={changeSelectCount}
                onDeleteProduct={onDeleteProduct}
              />
            ) : (
              <Blank
                title={'Немає замовлень в обробці'}
                image={imageBlank}
                alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
              />
            )
          ) : ordersType === 'ready' ? (
            readyOrders.length > 0 ? (
              <OrdersList
                orders={readyOrders}
                changeSelectCount={changeSelectCount}
                onDeleteProduct={onDeleteProduct}
              />
            ) : (
              <Blank
                title={'Немає виконаних замовлень'}
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
