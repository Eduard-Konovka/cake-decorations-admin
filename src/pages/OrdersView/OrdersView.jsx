import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState, useChangeGlobalState, updateOrders } from 'state';
import { fetchCollection } from 'api';
import { Spinner, Blank, OrdersList } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import imageBlank from 'assets/cartEmpty.png';
import s from './OrdersView.module.css';

export default function OrdersView({ changeSelectCount, onDeleteProduct }) {
  const { mainHeight, orders } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  useEffect(() => {
    if (orders.length === 0) {
      setLoading(true);

      fetchCollection('orders')
        .then(orders => {
          orders.sort(
            (firstProduct, secondProduct) =>
              secondProduct._id - firstProduct._id,
          );
          changeGlobalState(updateOrders, orders);
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      className={orders.length > 0 ? s.page : s.blank}
      style={{ minHeight: mainHeight }}
    >
      {loading && <Spinner size={70} color="red" />}

      {error && (
        <div className={s.errorBox}>
          <p className={s.errorLabel}>
            {languageDeterminer(LANGUAGE.viewError)}
          </p>
          <p className={s.errorText}>{error.message}</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 ? (
        <OrdersList
          orders={orders}
          changeSelectCount={changeSelectCount}
          onDeleteProduct={onDeleteProduct}
        />
      ) : (
        <Blank
          title={languageDeterminer(LANGUAGE.orders.title)}
          image={imageBlank}
          alt={languageDeterminer(LANGUAGE.orders.emptyOrdersAlt)}
        />
      )}
    </main>
  );
}

OrdersView.propTypes = {
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
