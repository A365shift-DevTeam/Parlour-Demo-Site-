import { create } from "zustand";
import { persist } from "zustand/middleware";
import { services } from "../data/mockData";
import type {
  Booking,
  BookingDraft,
  FaceShape,
  ServiceCategory,
  SkinTone,
} from "../types";
import type { AvatarAppearance, SavedStudioLook } from "../types/avatarAppearance";

const defaultAppearance: AvatarAppearance = {
  skinTone: "Medium",
  faceShape: "Oval",
  hairStyle: "Natural Layers",
  hairColor: "Espresso",
  makeup: "Bare",
  facialHair: "None",
  accessory: "None",
};

const defaultDraft: BookingDraft = {
  serviceIds: [],
  branchId: "",
  specialistId: "any",
  date: "",
  time: "",
  customer: { fullName: "", mobile: "", email: "", notes: "" },
};

const appearanceForService = (
  current: AvatarAppearance,
  visualEffect: Partial<AvatarAppearance>,
): AvatarAppearance => ({
  ...current,
  ...visualEffect,
});

interface StudioStore {
  appearance: AvatarAppearance;
  selectedCategory: ServiceCategory;
  selectedServiceIds: string[];
  savedLooks: SavedStudioLook[];
  bookingDraft: BookingDraft;
  bookingConfirmation?: Booking;
  notice: string;
  setAppearance: <K extends keyof AvatarAppearance>(key: K, value: AvatarAppearance[K]) => void;
  setSkinTone: (value: SkinTone) => void;
  setFaceShape: (value: FaceShape) => void;
  selectCategory: (category: ServiceCategory) => void;
  addService: (serviceId: string) => { ok: boolean; message: string };
  removeService: (serviceId: string) => void;
  clearLook: () => void;
  saveCurrentLook: (name?: string) => SavedStudioLook | null;
  renameSavedLook: (id: string, name: string) => void;
  removeSavedLook: (id: string) => void;
  duplicateSavedLook: (id: string) => void;
  loadSavedLook: (id: string) => void;
  startBooking: (serviceIds?: string[], lookId?: string) => void;
  updateBookingDraft: (updates: Partial<BookingDraft>) => void;
  confirmBooking: (booking: Booking) => void;
  setNotice: (notice: string) => void;
}

export const useStudioStore = create<StudioStore>()(
  persist(
    (set, get) => ({
      appearance: defaultAppearance,
      selectedCategory: "Hair",
      selectedServiceIds: [],
      savedLooks: [],
      bookingDraft: defaultDraft,
      bookingConfirmation: undefined,
      notice: "",
      setAppearance: (key, value) =>
        set((state) => ({ appearance: { ...state.appearance, [key]: value } })),
      setSkinTone: (skinTone) =>
        set((state) => ({ appearance: { ...state.appearance, skinTone } })),
      setFaceShape: (faceShape) =>
        set((state) => ({ appearance: { ...state.appearance, faceShape } })),
      selectCategory: (selectedCategory) => set({ selectedCategory }),
      addService: (serviceId) => {
        const service = services.find((item) => item.id === serviceId);
        if (!service) return { ok: false, message: "This service could not be found." };
        const state = get();
        if (state.selectedServiceIds.includes(serviceId))
          return { ok: true, message: `${service.name} is already in this look.` };
        const selected = services.filter((item) => state.selectedServiceIds.includes(item.id));
        const conflict = selected.find(
          (item) =>
            service.incompatibleWith?.includes(item.name) ||
            item.incompatibleWith?.includes(service.name),
        );
        if (conflict) {
          const message = `${service.name} cannot be combined with ${conflict.name}. Choose one haircut shape for this look.`;
          set({ notice: message });
          return { ok: false, message };
        }
        const message = `${service.name} added to your look.`;
        set({
          selectedServiceIds: [...state.selectedServiceIds, serviceId],
          appearance: appearanceForService(state.appearance, service.visualEffect),
          notice: message,
        });
        return { ok: true, message };
      },
      removeService: (serviceId) =>
        set((state) => ({
          selectedServiceIds: state.selectedServiceIds.filter((id) => id !== serviceId),
          notice: "Service removed from your look.",
        })),
      clearLook: () =>
        set({
          selectedServiceIds: [],
          appearance: defaultAppearance,
          notice: "Your look has been reset.",
        }),
      saveCurrentLook: (name) => {
        const state = get();
        if (!state.selectedServiceIds.length) {
          set({ notice: "Add at least one service before saving a look." });
          return null;
        }
        const now = new Date().toISOString();
        const look: SavedStudioLook = {
          id: `look-${Date.now()}`,
          name: name?.trim() || `My Aurelia Look ${state.savedLooks.length + 1}`,
          avatarId: "common-avatar",
          appearance: state.appearance,
          serviceIds: state.selectedServiceIds,
          createdAt: now,
          updatedAt: now,
        };
        set({
          savedLooks: [look, ...state.savedLooks],
          notice: `${look.name} saved on this device.`,
        });
        return look;
      },
      renameSavedLook: (id, name) =>
        set((state) => ({
          savedLooks: state.savedLooks.map((look) =>
            look.id === id ? { ...look, name, updatedAt: new Date().toISOString() } : look,
          ),
        })),
      removeSavedLook: (id) =>
        set((state) => ({
          savedLooks: state.savedLooks.filter((look) => look.id !== id),
          notice: "Saved look removed.",
        })),
      duplicateSavedLook: (id) =>
        set((state) => {
          const source = state.savedLooks.find((look) => look.id === id);
          if (!source) return state;
          const now = new Date().toISOString();
          const copy: SavedStudioLook = {
            ...source,
            id: `look-${Date.now()}`,
            name: `${source.name} Copy`,
            createdAt: now,
            updatedAt: now,
          };
          return { savedLooks: [copy, ...state.savedLooks], notice: "Look duplicated." };
        }),
      loadSavedLook: (id) =>
        set((state) => {
          const look = state.savedLooks.find((item) => item.id === id);
          if (!look) return state;
          return {
            appearance: look.appearance,
            selectedServiceIds: look.serviceIds,
            notice: `${look.name} opened in the studio.`,
          };
        }),
      startBooking: (serviceIds, lookId) =>
        set((state) => ({
          bookingDraft: {
            ...state.bookingDraft,
            serviceIds: serviceIds ?? state.selectedServiceIds,
            lookId,
          },
          bookingConfirmation: undefined,
        })),
      updateBookingDraft: (updates) =>
        set((state) => ({ bookingDraft: { ...state.bookingDraft, ...updates } })),
      confirmBooking: (bookingConfirmation) => set({ bookingConfirmation }),
      setNotice: (notice) => set({ notice }),
    }),
    {
      name: "aurelia-studio",
      partialize: (state) => ({
        appearance: state.appearance,
        selectedCategory: state.selectedCategory,
        selectedServiceIds: state.selectedServiceIds,
        savedLooks: state.savedLooks,
        bookingDraft: state.bookingDraft,
        bookingConfirmation: state.bookingConfirmation,
      }),
    },
  ),
);
