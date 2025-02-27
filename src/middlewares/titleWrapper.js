export default function titleWrapper(language, obj) {
  switch (language) {
    case 'UA':
      return obj?.uaTitle ?? obj?.title ?? obj?.ruTitle ?? obj?.enTitle;

    case 'RU':
      return obj?.ruTitle ?? obj?.title ?? obj?.uaTitle ?? obj?.enTitle;

    case 'EN':
      return obj?.enTitle ?? obj?.title ?? obj?.uaTitle ?? obj?.ruTitle;

    default:
      return obj?.title || '';
  }
}
