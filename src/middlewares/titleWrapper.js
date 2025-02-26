export default function titleWrapper(language, obj) {
  switch (language) {
    case 'UA':
      return obj.uaTitle;

    case 'RU':
      return obj.ruTitle;

    case 'EN':
      return obj.enTitle;

    default:
      return obj.title || '';
  }
}
