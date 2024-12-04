import dictionaries from 'db/dictionaries.json';

export default async function tagsApi() {
  const response = await dictionaries.tags;

  return response;
}
