export default function languageWrapper(lang, obj) {
  switch (lang) {
    case 'EN':
      return obj.eng;

    case 'UA':
      return obj.ukr || obj.eng;

    default:
      return obj.eng;
  }
}
