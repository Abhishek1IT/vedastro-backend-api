import { create } from "zustand";
import {
  ConsultationMode,
  ConsultationFilters,
  SortOption,
} from "../types/consultation";

interface ConsultationState {
  searchQuery: string;
  selectedConsultationType: ConsultationMode;
  selectedCategory: string;
  filters: ConsultationFilters;
  sortBy: SortOption;
  isMobileFilterOpen: boolean;

  setSearchQuery: (query: string) => void;
  setConsultationType: (type: ConsultationMode) => void;
  setCategory: (category: string) => void;
  setFilters: (filters: Partial<ConsultationFilters>) => void;
  setSortBy: (sort: SortOption) => void;
  setMobileFilterOpen: (open: boolean) => void;
  clearFilters: () => void;
}

const defaultFilters: ConsultationFilters = {
  consultationTypes: [],
  availability: [],
  experience: [],
  languages: [],
  priceRange: [0, 500],
  expertise: [],
};

export const useConsultationStore = create<ConsultationState>((set) => ({
  searchQuery: "",
  selectedConsultationType: "chat",
  selectedCategory: "All",
  filters: { ...defaultFilters },
  sortBy: "recommended",
  isMobileFilterOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setConsultationType: (type) => set({ selectedConsultationType: type }),
  setCategory: (category) => set({ selectedCategory: category }),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  setSortBy: (sort) => set({ sortBy: sort }),
  setMobileFilterOpen: (open) => set({ isMobileFilterOpen: open }),
  clearFilters: () => set({ filters: { ...defaultFilters }, searchQuery: "", selectedCategory: "All" }),
}));