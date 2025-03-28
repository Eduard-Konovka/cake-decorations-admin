import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGlobalState, useChangeGlobalState, authSignInUser } from 'state';
import { Spinner, Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import avatar from 'assets/avatar.png';
import s from './SignInView.module.css';

const initialState = {
  email: '',
  password: '',
};

export default function SignInView() {
  const { mainHeight } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initialState);

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const handleEmailChange = event => {
    const value = event.target.value.trim();

    setState(prevState => ({
      ...prevState,
      email: value,
    }));
  };

  const handlePasswordChange = event => {
    const value = event.target.value.trim();

    setState(prevState => ({
      ...prevState,
      password: value,
    }));
  };

  const handleLoginPress = () => {
    setLoading(true);

    if (!state.email || state.email === '') {
      toast.error(
        languageDeterminer(LANGUAGE.authorizationViews.alert.noEmail),
      );
      setState(initialState);
      setLoading(false);
    } else if (!state.password || state.password === '') {
      toast.error(
        languageDeterminer(LANGUAGE.authorizationViews.alert.noPassword),
      );
      setState(initialState);
      setLoading(false);
    } else {
      changeGlobalState(authSignInUser, {
        user: state,
        errorTitle: languageDeterminer(
          LANGUAGE.authorizationViews.alert.authSignInUser,
        ),
      });
      setState(initialState);
      setLoading(false);
    }
  };

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      {loading ? (
        <Spinner size={70} color="red" />
      ) : (
        <section className={s.thumb}>
          <img src={avatar} alt="avatar" className={s.avatar} />

          <form className={s.form}>
            <label htmlFor="email" className={s.label}>
              {languageDeterminer(LANGUAGE.authorizationViews.email.label)}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              title={languageDeterminer(
                LANGUAGE.authorizationViews.email.title,
              )}
              pattern={languageDeterminer(GLOBAL.inputs.email.pattern)}
              placeholder={languageDeterminer(
                LANGUAGE.authorizationViews.email.placeholder,
              )}
              autoComplete="email"
              className={s.input}
              onChange={handleEmailChange}
            />

            <label htmlFor="password" className={s.label}>
              {languageDeterminer(LANGUAGE.authorizationViews.password.label)}
            </label>

            <input
              id="password"
              name="password"
              type="password"
              title={languageDeterminer(
                LANGUAGE.authorizationViews.password.title,
              )}
              pattern={languageDeterminer(GLOBAL.inputs.password.pattern)}
              placeholder={languageDeterminer(
                LANGUAGE.authorizationViews.password.placeholder,
              )}
              autoComplete="current-password"
              minLength={GLOBAL.inputs.password.minLength}
              maxLength={GLOBAL.inputs.password.maxLength}
              className={s.input}
              onChange={handlePasswordChange}
            />

            <Button
              title={languageDeterminer(
                LANGUAGE.authorizationViews.signInButton.title,
              )}
              type="button"
              typeForm="signin"
              disabled={
                state.password.length < GLOBAL.inputs.password.minLength ||
                state.password.length > GLOBAL.inputs.password.maxLength
              }
              onClick={handleLoginPress}
            >
              {state.email.length > 5 &&
              state.password.length >= GLOBAL.inputs.password.minLength &&
              state.password.length <= GLOBAL.inputs.password.maxLength ? (
                <Link to="/categories" className={s.btnLink}>
                  {languageDeterminer(
                    LANGUAGE.authorizationViews.signInButton.text,
                  )}
                </Link>
              ) : (
                <p className={s.btnLink}>
                  {languageDeterminer(
                    LANGUAGE.authorizationViews.signInButton.text,
                  )}
                </p>
              )}
            </Button>
          </form>
        </section>
      )}
    </main>
  );
}
