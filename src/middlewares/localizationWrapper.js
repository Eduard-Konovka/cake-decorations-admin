export default function localizationWrapper(language, obj, title, description) {
  switch (language) {
    case 'UA':
      obj.title = { ua: title };
      obj.description = { ua: description };
      break;

    case 'RU':
      obj.title = { ru: title };
      obj.description = { ru: description };
      break;

    case 'EN':
      obj.title = { en: title };
      obj.description = { en: description };
      break;

    default:
      obj.title = { ua: title };
      obj.description = { ua: description };
      break;
  }

  return obj;
}
