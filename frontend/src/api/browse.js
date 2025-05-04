// src/api/browse.js
import { api } from "./auth";

export const getPredefinedCatalogTypes = () => api.get("predefined-types/");
export const getPredefinedCatalogs = () => api.get("predefined-catalogs/");
