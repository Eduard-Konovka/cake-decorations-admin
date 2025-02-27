export default function descriptionWrapper(language, obj) {
  switch (language) {
    case 'UA':
      return (
        obj?.uaDescription ??
        obj?.description ??
        obj?.ruDescription ??
        obj?.enDescription
      );

    case 'RU':
      return (
        obj?.ruDescription ??
        obj?.description ??
        obj?.uaDescription ??
        obj?.enDescription
      );

    case 'EN':
      return (
        obj?.enDescription ??
        obj?.description ??
        obj?.uaDescription ??
        obj?.ruDescription
      );

    default:
      return obj?.description ?? '';
  }
}
