export default function descriptionWrapper(language, obj) {
  switch (language) {
    case 'UA':
      return obj.uaDescription;

    case 'RU':
      return obj.ruDescription;

    case 'EN':
      return obj.enDescription;

    default:
      return obj.description || '';
  }
}
