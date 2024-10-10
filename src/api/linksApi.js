import dictionaries from 'db/dictionaries.json';

export default async function linksApi() {
  const response = await dictionaries.links;

  return response;
}
