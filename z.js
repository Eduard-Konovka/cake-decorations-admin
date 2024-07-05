import { getLanguage } from 'functions';
import { languageWrapper } from 'middlewares';
import { LANGUAGE } from 'constants';

const languageDeterminer = obj => languageWrapper(getLanguage(), obj);

languageDeterminer(LANGUAGE.brand);
