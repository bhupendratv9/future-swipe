import { create } from "zustand";
import { persist } from "zustand/middleware";

type SwipeAction = "like" | "dislike";

interface SwipeItem {
  card_id: string;
  action: SwipeAction;
}

interface SwipeState {
  sessionId: string;
  swipes: SwipeItem[];

  setSessionId: (id: string) => void;
  addSwipe: (card_id: string, action: SwipeAction) => void;
  clearSwipes: () => void;
  clearSession: () => void;
}

export const useSwipeStore = create<SwipeState>()(
  persist(
    (set) => ({
      sessionId: "",
      swipes: [],

      setSessionId: (id: string) =>
        set(() => ({
          sessionId: id,
        })),

      addSwipe: (card_id, action) =>
        set((state) => {
          const filtered = state.swipes.filter(
            (s) => s.card_id !== card_id
          );

          return {
            swipes: [...filtered, { card_id, action }],
          };
        }),

      clearSwipes: () => set({ swipes: [] }),

      clearSession: () => set({ sessionId: "" }),
    }),
    {
      name: "swipe-storage", // saved in localStorage
      partialize: (state) => ({
        sessionId: state.sessionId,

      }),
    }
  )
);