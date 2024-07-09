import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './Footer.module.css';

export default function Footer() {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <footer className={s.footer}>
      {languageDeterminer(LANGUAGE.footer.label)}
      <a
        title={languageDeterminer(LANGUAGE.footer.title)}
        href="https://eduard-konovka.github.io/resume-pdf/"
        target="_blank"
        rel="noopener noreferrer"
        className={s.link}
      >
        {languageDeterminer(LANGUAGE.footer.name)}
      </a>
      ©{new Date().getFullYear()}
    </footer>
  );
}
