export const getSearchUrl = (query: string, search_uuid: string) => {
  const prefix =
    process.env.NODE_ENV === "production" ? "/search.html" : "/search";
  return `${prefix}?q=${encodeURIComponent(query)}&rid=${search_uuid}`;
};
