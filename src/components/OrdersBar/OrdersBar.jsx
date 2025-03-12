import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { Order, Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './OrdersBar.module.css';

export default function OrdersBar({ changeSelectCount, onDeleteProduct }) {
  const { orders } = useGlobalState('global');

  const [totalCost, setTotalCost] = useState(0);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    setTotalCost(
      orders.reduce((acc, obj) => acc + obj.count * obj.price, 0).toFixed(2),
    );
  }, [orders]);

  return (
    <div className={s.cartbar}>
      <Order
        orders={orders}
        changeSelectCount={changeSelectCount}
        onDeleteProduct={onDeleteProduct}
      />

      <div className={s.priceBox}>
        <p className={s.totalCost}>
          {languageDeterminer(LANGUAGE.cartBar.totalCost)}
          {totalCost} ₴
        </p>

        <Button
          title={languageDeterminer(LANGUAGE.cartBar.buttonTitle)}
          type="button"
          onClick={() => alert(Number(totalCost))}
        >
          {languageDeterminer(LANGUAGE.cartBar.buttonText)}
        </Button>
      </div>
    </div>
  );
}

OrdersBar.propTypes = {
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
