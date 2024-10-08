import tags from 'db/tags.json';

export default async function tagsApi() {
  const response = await tags;

  return response;
}
