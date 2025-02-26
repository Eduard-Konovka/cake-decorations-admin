export default function descriptionWrapper(language, obj) {
  switch (language) {
    case 'UA':
      return obj?.uaDescription ?? obj?.description;

    case 'RU':
      return obj?.ruDescription ?? obj?.description;

    case 'EN':
      return obj?.enDescription ?? obj?.description;

    default:
      return obj?.description || '';
  }
}
