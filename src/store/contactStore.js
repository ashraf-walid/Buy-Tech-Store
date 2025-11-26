import { create } from 'zustand';

const useContactStore = create((set, get) => ({
    messages: [],
    isLoading: false,
    error: null,
    hasFetched: false,

    fetchMessages: async () => {
        const { hasFetched, isLoading } = get();
        if (hasFetched || isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch("/api/contact");
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            set({ messages: data, hasFetched: true, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteMessage: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete message");

            set((state) => ({
                messages: state.messages.filter((msg) => msg._id !== id),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, message: error.message };
        }
    },
}));

export default useContactStore;
