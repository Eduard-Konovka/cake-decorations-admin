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

export default function AppBar({ setBooksByTag }) {
  const { user, language } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <header className={s.header}>
      <nav className={s.nav}>
        <div className={s.headbar}>
          {user.name ? (
            <NavLink
              title="Go to book list"
              to="/books"
              className={({ isActive }) =>
                isActive ? s.activeLink : s.inactiveLink
              }
              onClick={setBooksByTag}
              end
            >
              <div className={s.logoBox}>
                <img
                  className={s.logo}
                  src={logo}
                  alt={languageDeterminer(LANGUAGE.logoAlt)}
                />
                <h1 className={s.brand}>
                  {languageDeterminer(LANGUAGE.brand)}
                </h1>
              </div>
            </NavLink>
          ) : (
            <div className={s.logoBox}>
              <img
                className={s.logo}
                src={logo}
                alt={languageDeterminer(LANGUAGE.logoAlt)}
              />
              <h1 className={s.brand}>{languageDeterminer(LANGUAGE.brand)}</h1>
            </div>
          )}
        </div>

        {user.name ? (
          <div className={s.userbar}>
            <NavLink
              title={languageDeterminer(LANGUAGE.appBar.cartLink)}
              to="/cart"
              className={({ isActive }) =>
                isActive ? s.activeCart : s.inactiveCart
              }
            />

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
          <p className={s.user}>{languageDeterminer(LANGUAGE.appBar.hello)}</p>
        )}
      </nav>

      <Button
        title={languageDeterminer(LANGUAGE.appBar.language)}
        typeForm="icon"
        disabled={language === 'EN'}
        onClick={() => changeGlobalState(updateLanguage, 'EN')}
      >
        {'EN'}
      </Button>

      {'|'}

      <Button
        title={languageDeterminer(LANGUAGE.appBar.language)}
        typeForm="icon"
        disabled={language === 'UA'}
        onClick={() => changeGlobalState(updateLanguage, 'UA')}
      >
        {'UA'}
      </Button>
    </header>
  );
}

AppBar.propTypes = {
  setBooksByTag: PropTypes.func.isRequired,
};
