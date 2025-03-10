export default function propertyWrapper(language, obj, property) {
  switch (language) {
    case 'UA':
      return (
        obj?.[property]?.ua ?? obj?.[property]?.ru ?? obj?.[property]?.en ?? ''
      );

    case 'RU':
      return (
        obj?.[property]?.ru ?? obj?.[property]?.ua ?? obj?.[property]?.en ?? ''
      );

    case 'EN':
      return (
        obj?.[property]?.en ?? obj?.[property]?.ua ?? obj?.[property]?.ru ?? ''
      );

    default:
      return obj?.[property]?.ua ?? '';
  }
}
