export default function titleWrapper(language, obj) {
  switch (language) {
    case 'UA':
      return obj?.uaTitle ?? obj?.title;

    case 'RU':
      return obj?.ruTitle ?? obj?.title;

    case 'EN':
      return obj?.enTitle ?? obj?.title;

    default:
      return obj?.title || '';
  }
}
