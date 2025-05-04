import { api } from "./auth";

export const fetchPredefinedTypes = async () => {
  const response = await api.get("predefined-types/");
  return response.data.results;
};

export const searchCatalogs = async (query) => {
  const response = await api.get(`search/?q=${encodeURIComponent(query)}`);
  return response.data.results;
};