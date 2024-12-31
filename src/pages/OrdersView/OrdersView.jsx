import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { CartBar, Blank, Processing } from 'components';
import { getLanguage, pageUp } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import imageBlank from 'assets/cartEmpty.png';
import s from './OrdersView.module.css';

export default function OrdersView({
  sending,
  changeSelectCount,
  onDeleteProduct,
  onSubmit,
}) {
  const { mainHeight, cart } = useGlobalState('global');

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  return (
    <main
      className={!sending && cart.length > 0 ? s.page : s.blank}
      style={{ minHeight: mainHeight }}
    >
      {!sending && cart.length > 0 ? (
        <CartBar
          changeSelectCount={changeSelectCount}
          onDeleteProduct={onDeleteProduct}
          onSubmit={onSubmit}
        />
      ) : sending ? (
        <Processing />
      ) : (
        <Blank
          title={languageDeterminer(LANGUAGE.cart.title)}
          image={imageBlank}
          alt={languageDeterminer(LANGUAGE.cart.emptyCartAlt)}
        />
      )}
    </main>
  );
}

OrdersView.propTypes = {
  sending: PropTypes.bool.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
