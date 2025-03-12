import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { OrdersBar, Blank } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import imageBlank from 'assets/cartEmpty.png';
import s from './OrdersView.module.css';

export default function OrdersView({ changeSelectCount, onDeleteProduct }) {
  const { mainHeight, orders } = useGlobalState('global');

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  return (
    <main
      className={orders.length > 0 ? s.page : s.blank}
      style={{ minHeight: mainHeight }}
    >
      {orders.length > 0 ? (
        <OrdersBar
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
