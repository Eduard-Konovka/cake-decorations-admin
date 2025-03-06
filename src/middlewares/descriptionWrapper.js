export default function descriptionWrapper(language, obj) {
  switch (language) {
    case 'UA':
      return (
        obj?.description?.ua ??
        obj?.description?.ru ??
        obj?.description?.en ??
        ''
      );

    case 'RU':
      return (
        obj?.description?.ru ??
        obj?.description?.ua ??
        obj?.description?.en ??
        ''
      );

    case 'EN':
      return (
        obj?.description?.en ??
        obj?.description?.ua ??
        obj?.description?.ru ??
        ''
      );

    default:
      return obj?.description?.ua ?? '';
  }
}
