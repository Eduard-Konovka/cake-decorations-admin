export default function languageWrapper(lang, obj) {
  switch (lang) {
    case 'UA':
      return obj.ukr;

    case 'RU':
      return obj.rus || obj.ukr;

    case 'EN':
      return obj.eng || obj.ukr;

    default:
      return obj.ukr;
  }
}
