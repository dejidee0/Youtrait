import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null, session: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useProfileStore = create((set, get) => ({
  profile: null,
  traits: [],
  endorsements: [],
  setProfile: (profile) => set({ profile }),
  setTraits: (traits) => set({ traits }),
  setEndorsements: (endorsements) => set({ endorsements }),
  addTrait: (trait) => set((state) => ({ traits: [...state.traits, trait] })),
  updateTrait: (traitId, updates) => set((state) => ({
    traits: state.traits.map(t => t.id === traitId ? { ...t, ...updates } : t)
  })),
}));

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  typingUsers: [],
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setTypingUsers: (users) => set({ typingUsers: users }),
}));