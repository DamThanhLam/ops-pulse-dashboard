import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastState = {
  toast: ToastMessage | null;
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
};

export const useToast = create<ToastState>((set) => ({
  toast: null,
  showToast: (type, message) => {
    const id = Date.now();
    set({ toast: { id, type, message } });
    setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null } : state));
    }, 3200);
  },
  hideToast: () => set({ toast: null })
}));
