export const getSearchUrl = (query: string, search_uuid: string) => {
  return `/search?q=${encodeURIComponent(query)}&rid=${search_uuid}`;
};
