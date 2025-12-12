
import { create } from "zustand";
import convertJsonToRoutes from "./convertJsonToRoutes"
// useRoutesStore.js
export const useRoutesStore = create((set) => ({
  routes: [],
  setRoutes: (arr) => set({ routes: convertJsonToRoutes(arr) }),
}));
