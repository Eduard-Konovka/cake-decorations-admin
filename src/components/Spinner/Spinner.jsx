import { FcSettings } from 'react-icons/fc';
import { IoMdCog } from 'react-icons/io';
import { AiFillSetting } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';
import s from './Spinner.module.css';

export default function Spinner({ size = 50, color = 'black' }) {
  const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

  return (
    <div className={s.box}>
      <FcSettings
        size={size}
        className={s.spinner}
        alt={languageDeterminer(LANGUAGE.spinnerAlt)}
      />
      <IoMdCog
        size={size * 1.6}
        className={s[color]}
        alt={languageDeterminer(LANGUAGE.spinnerAlt)}
      />
      <AiFillSetting
        size={size * 0.6}
        className={s.gray}
        alt={languageDeterminer(LANGUAGE.spinnerAlt)}
      />
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.oneOf(['black', 'white', 'red', 'blue', 'green', 'gray']),
};
