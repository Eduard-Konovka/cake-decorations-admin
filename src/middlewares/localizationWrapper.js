export default function localizationWrapper(language, obj, title, description) {
  switch (language) {
    case 'UA':
      obj.uaTitle = title;
      obj.uaDescription = description;
      return obj;

    case 'RU':
      obj.ruTitle = title;
      obj.ruDescription = description;
      return obj;

    case 'EN':
      obj.enTitle = title;
      obj.enDescription = description;
      return obj;

    default:
      obj.title = title;
      obj.tescription = description;
      return obj;
  }
}
