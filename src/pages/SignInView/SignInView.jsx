import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState, useChangeGlobalState, updateUser } from 'state';
import { Button } from 'components';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { GLOBAL, LANGUAGE } from 'constants';
import avatar from 'assets/avatar.png';
import s from './SignInView.module.css';

export default function SignInView() {
  const { mainHeight } = useGlobalState('global');
  const changeGlobalState = useChangeGlobalState();

  const [name, setName] = useState('');

  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  const handleChange = event => {
    const value = event.target.value.trim();
    setName(value);
  };

  return (
    <main className={s.page} style={{ minHeight: mainHeight }}>
      <section className={s.thumb}>
        <img src={avatar} alt="avatar" className={s.avatar} />

        <form className={s.form}>
          <label htmlFor="username" className={s.label}>
            {languageDeterminer(LANGUAGE.signInView.username)}
          </label>

          <input
            id="username"
            name="username"
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
            onChange={handleChange}
          />

          <Button
            title={languageDeterminer(LANGUAGE.signInView.buttonTitle)}
            type="button"
            typeForm="signin"
            disabled={
              name.length < GLOBAL.signInView.input.minLength ||
              name.length > GLOBAL.signInView.input.maxLength
            }
            onClick={() => changeGlobalState(updateUser, { name })}
          >
            {name.length >= GLOBAL.signInView.input.minLength &&
            name.length <= GLOBAL.signInView.input.maxLength ? (
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
