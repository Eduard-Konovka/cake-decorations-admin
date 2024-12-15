import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  updateUser,
  updateLanguage,
} from 'state';
import { Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import logo from 'assets/logo.jpg';
import defaultAvatar from 'assets/defaultAvatar.png';
import s from './AppBar.module.css';

export default function AppBar({ setDefaultsProducts }) {
  const { user, language, cart } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <header id="header" className={s.header}>
      <div className={s.panel}>
        <NavLink
          title={languageDeterminer(LANGUAGE.appBar.categoriesLink)}
          to="/categories"
          className={s.link}
          onClick={setDefaultsProducts}
          end
        >
          <div className={s.logoBox}>
            <img
              className={s.logo}
              src={logo}
              alt={languageDeterminer(LANGUAGE.logoAlt)}
            />
            <h1 className={s.brand}>
              {languageDeterminer(LANGUAGE.titles.brand)}
            </h1>
          </div>
        </NavLink>

        <div className={s.infoBox}>
          <p className={s.brandInfo}>
            {languageDeterminer(LANGUAGE.appBar.title)}
          </p>
        </div>

        <div className={s.controlBox}>
          {user.name ? (
            <div className={s.userbar}>
              <Button
                title={languageDeterminer(LANGUAGE.appBar.signOut.title)}
                type="button"
                onClick={() => changeGlobalState(updateUser, {})}
              >
                <Link to="/signin" className={s.btnLink}>
                  {languageDeterminer(LANGUAGE.appBar.signOut.text)}
                </Link>
              </Button>

              <img
                className={s.avatar}
                src={user.avatar ?? defaultAvatar}
                alt={languageDeterminer(LANGUAGE.appBar.avatarAlt)}
              />

              <p className={s.user}>{user.name}</p>
            </div>
          ) : (
            <p className={s.user}>
              {languageDeterminer(LANGUAGE.appBar.hello)}
            </p>
          )}

          <div className={s.languageBox}>
            <Button
              title={languageDeterminer(LANGUAGE.appBar.language)}
              typeForm="icon"
              disabled={language === 'UA'}
              styles={s.lngBtn}
              onClick={() => changeGlobalState(updateLanguage, 'UA')}
            >
              {'UA'}
            </Button>

            <Button
              title={languageDeterminer(LANGUAGE.appBar.language)}
              typeForm="icon"
              disabled={language === 'RU'}
              styles={s.lngBtn}
              onClick={() => changeGlobalState(updateLanguage, 'RU')}
            >
              {'RU'}
            </Button>

            <Button
              title={languageDeterminer(LANGUAGE.appBar.language)}
              typeForm="icon"
              disabled={language === 'EN'}
              styles={s.lngBtn}
              onClick={() => changeGlobalState(updateLanguage, 'EN')}
            >
              {'EN'}
            </Button>
          </div>
        </div>
      </div>

      <nav className={s.nav}>
        {user.name && (
          <>
            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.categoriesLink)}
              to="/categories"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              onClick={setDefaultsProducts}
              end
            >
              {languageDeterminer(LANGUAGE.titles.categories)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.productsLink)}
              to="/products"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              onClick={setDefaultsProducts}
              end
            >
              {languageDeterminer(LANGUAGE.titles.products)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.deletedLink)}
              to="/products/deleted"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.deleted)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.ordersLink)}
              to="/orders"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.orders)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.messagesLink)}
              to="/messages"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.messages)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.notificationsLink)}
              to="/notifications"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.notifications)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.promotionsLink)}
              to="/promotions"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.promotions)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.statisticsLink)}
              to="/statistics"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.statistics)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.clientsLink)}
              to="/clients"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.clients)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.reviewsLink)}
              to="/reviews"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.reviews)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.cartLink)}
              to="/cart"
              className={({ isActive }) =>
                isActive ? s.activeCart : s.inactiveCart
              }
            >
              <span className={s.quantityInCart}>{cart.length}</span>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

AppBar.propTypes = {
  setDefaultsProducts: PropTypes.func.isRequired,
};
