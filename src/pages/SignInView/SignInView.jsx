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
            type="text"
            name="username"
            title={languageDeterminer(LANGUAGE.signInView.inputTitle)}
            pattern={languageDeterminer(GLOBAL.signInViewPattern)}
            placeholder={languageDeterminer(
              LANGUAGE.signInView.inputPlaceholder,
            )}
            minLength={GLOBAL.signInViewInput.minLength}
            maxLength={GLOBAL.signInViewInput.maxLength}
            className={s.input}
            onChange={handleChange}
          />

          <Button
            title={languageDeterminer(LANGUAGE.signInView.buttonTitle)}
            type="button"
            typeForm="signin"
            disabled={
              name.length < GLOBAL.signInViewInput.minLength ||
              name.length > GLOBAL.signInViewInput.maxLength
            }
            onClick={() => changeGlobalState(updateUser, { name })}
          >
            {name.length >= GLOBAL.signInViewInput.minLength &&
            name.length <= GLOBAL.signInViewInput.maxLength ? (
              <Link to="/products" className={s.btnLink}>
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
