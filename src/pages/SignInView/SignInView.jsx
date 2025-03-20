import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGlobalState,
  useChangeGlobalState,
  updateUser,
  authSignInUser,
} from 'state';
import { Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE, LOGIN } from 'constants';
import avatar from 'assets/avatar.png';
import s from './SignInView.module.css';

const initialState = {
  email: '',
  password: '',
};

export default function SignInView() {
  const { mainHeight } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

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

  const handlePress = () => {
    if (!state.email || state.email === '') {
      toast.error(
        `${languageDeterminer(LOGIN.alert.noEmail.title)}: 
        ${languageDeterminer(LOGIN.alert.noEmail.description)}`,
      );
    } else if (!state.password || state.password === '') {
      toast.error(
        `${languageDeterminer(LOGIN.alert.noPassword.title)}
        ${languageDeterminer(LOGIN.alert.noPassword.description)}`,
      );
    } else {
      changeGlobalState(updateUser, { name: state.email });
      changeGlobalState(authSignInUser, {
        user: state,
        errorTitle: languageDeterminer(LOGIN.alert.authSignInUser),
      });
      setState(initialState);
    }
  };

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      <section className={s.thumb}>
        <img src={avatar} alt="avatar" className={s.avatar} />

        <form className={s.form}>
          <label htmlFor="email" className={s.label}>
            {languageDeterminer(LANGUAGE.signInView.username)}
          </label>

          <input
            id="email"
            name="email"
            type="text"
            title={languageDeterminer(LANGUAGE.signInView.inputTitle)}
            placeholder={'Введідь ел. пошту...'}
            autoComplete="email"
            minLength={GLOBAL.signInView.input.minLength}
            maxLength={GLOBAL.signInView.input.maxLength}
            className={s.input}
            onChange={handleEmailChange}
          />

          <label htmlFor="password" className={s.label}>
            {languageDeterminer(LANGUAGE.signInView.username)}
          </label>

          <input
            id="password"
            name="password"
            type="text"
            title={languageDeterminer(LANGUAGE.signInView.inputTitle)}
            pattern={languageDeterminer(GLOBAL.signInView.pattern)}
            placeholder={languageDeterminer(
              LANGUAGE.signInView.inputPlaceholder,
            )}
            autoComplete="given-name family-name"
            minLength={GLOBAL.signInView.input.minLength}
            maxLength={GLOBAL.signInView.input.maxLength}
            className={s.input}
            onChange={handlePasswordChange}
          />

          <Button
            title={languageDeterminer(LANGUAGE.signInView.buttonTitle)}
            type="button"
            typeForm="signin"
            disabled={
              state.email.length < GLOBAL.signInView.input.minLength ||
              state.email.length > GLOBAL.signInView.input.maxLength
            }
            onClick={handlePress}
          >
            {state.email.length >= GLOBAL.signInView.input.minLength &&
            state.email.length <= GLOBAL.signInView.input.maxLength ? (
              <Link to="/categories" className={s.btnLink}>
                {languageDeterminer(LANGUAGE.signInView.buttonText)}
              </Link>
            ) : (
              <p className={s.btnLink}>
                {languageDeterminer(LANGUAGE.signInView.buttonText)}
              </p>
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}
