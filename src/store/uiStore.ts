import { create } from 'zustand';
import type { ToastMessage } from '@/types';

export type SheetName = 'cart' | 'menu' | 'filters' | 'search' | 'admin' | null;

export interface UIState {
  sheet: SheetName;
  openSheet: (sheet: SheetName) => void;
  closeSheet: () => void;
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  orderModalOpen: boolean;
  setOrderModalOpen: (open: boolean) => void;
}

let toastSeq = 0;

export const useUIStore = create<UIState>()((set) => ({
  sheet: null,
  openSheet: (sheet) => set({ sheet }),
  closeSheet: () => set({ sheet: null }),
  toasts: [],
  pushToast: (toast) => {
    toastSeq += 1;
    const id = `toast_${toastSeq}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
    }, 4200);
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
  orderModalOpen: false,
  setOrderModalOpen: (open) => set({ orderModalOpen: open }),
}));