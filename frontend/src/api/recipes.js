import { api } from "./auth";

export const getRecipe = id => api.get(`recipes/${id}/`);