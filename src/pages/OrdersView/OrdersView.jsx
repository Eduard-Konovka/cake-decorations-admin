import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGlobalState } from 'state';
import { OrdersBar, Blank, Processing } from 'components';
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
  const { mainHeight, orders } = useGlobalState('global');

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  useEffect(pageUp, []);

  return (
    <main
      className={!sending && orders.length > 0 ? s.page : s.blank}
      style={{ minHeight: mainHeight }}
    >
      {!sending && orders.length > 0 ? (
        <OrdersBar
          changeSelectCount={changeSelectCount}
          onDeleteProduct={onDeleteProduct}
          onSubmit={onSubmit}
        />
      ) : sending ? (
        <Processing />
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
  sending: PropTypes.bool.isRequired,
  changeSelectCount: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
