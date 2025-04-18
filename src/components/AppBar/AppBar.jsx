import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  useGlobalState,
  useChangeGlobalState,
  updateLanguage,
  authSignOutUser,
} from 'state';
import { Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import { auth } from 'db';
import logo from 'assets/logo.jpg';
import defaultAvatar from 'assets/defaultAvatar.png';
import s from './AppBar.module.css';

export default function AppBar({ setDefaultsProducts }) {
  const navigate = useNavigate();
  const { language, orders } = useGlobalState('global');
  const { user } = useGlobalState('auth');
  const changeGlobalState = useChangeGlobalState();

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const newOrders = orders?.filter(
    order => order.type === GLOBAL.ordersTypes.new,
  );

  const signOut = () => {
    changeGlobalState(authSignOutUser);
  };

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
          <div className={s.userbar}>
            <Button
              title={
                auth?.currentUser
                  ? languageDeterminer(LANGUAGE.appBar.signOut.title)
                  : languageDeterminer(LANGUAGE.appBar.signIn.title)
              }
              type="button"
              typeForm="icon"
              className={s.avatarBtn}
              onClick={auth?.currentUser ? signOut : () => navigate('/signin')}
            >
              <img
                className={s.avatar}
                src={user?.avatar?.length > 0 ? user.avatar : defaultAvatar}
                alt={languageDeterminer(LANGUAGE.appBar.avatarAlt)}
              />
            </Button>

            <p className={s.user}>
              {auth.currentUser
                ? user?.firstName
                : languageDeterminer(LANGUAGE.appBar.hello)}
            </p>
          </div>

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
        {auth.currentUser && (
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
              to="/removedProducts"
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
              {newOrders?.length > 0 && (
                <span className={s.quantityIcon}>{newOrders.length}</span>
              )}
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
              title={languageDeterminer(LANGUAGE.appBar.settingsLink)}
              to="/settings"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              end
            >
              {languageDeterminer(LANGUAGE.titles.settings)}
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
