// TODO: BASE_URL should come from env variable, too lazy to work on different envs for now :)
export const BASE_URL =
  typeof window !== 'undefined' ? window.location.origin : '';
export const SEARCH_API_ROUTE = `${BASE_URL}/api/search`;
