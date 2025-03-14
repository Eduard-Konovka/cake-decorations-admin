import React from 'react';
import PropTypes from 'prop-types';
import { OrderedProduct, Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './Order.module.css';

export default function Order({ order, changeSelectCount, onDeleteProduct }) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

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
          {languageDeterminer(LANGUAGE.cartBar.totalCost)}
          {order.totalCost} ₴
        </p>

        <Button
          title={languageDeterminer(LANGUAGE.cartBar.buttonTitle)}
          type="button"
          onClick={() => alert(Number(order.totalCost))}
        >
          {languageDeterminer(LANGUAGE.cartBar.buttonText)}
        </Button>
      </div>
    </section>
  );
}

Order.propTypes = {
  order: PropTypes.object.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};
