import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { CartList, Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './CartBar.module.css';

export default function CartBar({ changeSelectCount, onDeleteBook, onSubmit }) {
  const { cart } = useGlobalState('global');

  const [totalCost, setTotalCost] = useState(0);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(() => {
    setTotalCost(
      cart.reduce((acc, obj) => acc + obj.count * obj.price, 0).toFixed(2),
    );
  }, [cart]);

  return (
    <div className={s.cartbar}>
      <CartList
        cart={cart}
        changeSelectCount={changeSelectCount}
        onDeleteBook={onDeleteBook}
      />

      <div className={s.priceBox}>
        <p className={s.totalCost}>
          {languageDeterminer(LANGUAGE.cartBar.totalCost)}
          {totalCost}
        </p>

        <Button
          title={languageDeterminer(LANGUAGE.cartBar.buttonTitle)}
          type="button"
          onClick={() => onSubmit(Number(totalCost))}
        >
          {languageDeterminer(LANGUAGE.cartBar.buttonText)}
        </Button>
      </div>
    </div>
  );
}

CartBar.propTypes = {
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteBook: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
