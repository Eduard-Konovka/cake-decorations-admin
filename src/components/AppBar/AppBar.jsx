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
            {'Центральний ринок, магазин № 316, Ізмаїл, Україна'}
          </p>

          <div className={s.phoneBox}>
            <p className={s.brandInfo}>{'+380 (50) 131-66-43'}</p>
            <p className={s.brandInfo}>{'+380 (98) 133-20-37'}</p>
          </div>
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
            disabled={language === 'EN'}
            styles={s.lngBtn}
            onClick={() => changeGlobalState(updateLanguage, 'EN')}
          >
            {'EN'}
          </Button>
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
              title={languageDeterminer(LANGUAGE.appBar.aboutLink)}
              to="/about"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.about)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.contactsLink)}
              to="/contacts"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.contacts)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.deliveryLink)}
              to="/delivery"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.delivery)}
            </NavLink>

            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.portfolioLink)}
              to="/portfolio"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.portfolio)}
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
