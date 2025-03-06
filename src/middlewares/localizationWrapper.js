export default function localizationWrapper(language, obj, title, description) {
  switch (language) {
    case 'UA':
      obj.title.ua = title;
      obj.description.ua = description;
      return obj;

    case 'RU':
      obj.title.ru = title;
      obj.description.ru = description;
      return obj;

    case 'EN':
      obj.title.en = title;
      obj.description.en = description;
      return obj;

    default:
      obj.title.ua = title;
      obj.description.ua = description;
      return obj;
  }
}
