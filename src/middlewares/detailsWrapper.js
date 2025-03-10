export default function detailsWrapper(language, obj) {
  switch (language) {
    case 'UA':
      return (
        obj?.product_details?.ua ??
        obj?.product_details?.ru ??
        obj?.product_details?.en ??
        ''
      );

    case 'RU':
      return (
        obj?.product_details?.ru ??
        obj?.product_details?.ua ??
        obj?.product_details?.en ??
        ''
      );

    case 'EN':
      return (
        obj?.product_details?.en ??
        obj?.product_details?.ua ??
        obj?.product_details?.ru ??
        ''
      );

    default:
      return obj?.product_details?.ua ?? '';
  }
}
