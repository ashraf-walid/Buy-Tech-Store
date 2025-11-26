import { create } from 'zustand';

const useCouponStore = create((set, get) => ({
    coupons: [],
    isLoading: false,
    error: null,
    hasFetched: false,

    fetchCoupons: async () => {
        const { hasFetched, isLoading } = get();
        if (hasFetched || isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/coupons');
            const data = await response.json();
            if (response.ok) {
                set({ coupons: data, hasFetched: true, isLoading: false });
            } else {
                set({ error: data.message || 'Failed to fetch coupons', isLoading: false });
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addCoupon: async (couponData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(couponData),
            });
            const data = await response.json();
            if (response.ok) {
                set((state) => ({
                    coupons: [...state.coupons, data.coupon || data], // Adjust based on API response structure
                    isLoading: false,
                }));
                return { success: true };
            } else {
                set({ error: data.message, isLoading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, message: error.message };
        }
    },

    updateCoupon: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/coupons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            const data = await response.json();
            if (response.ok) {
                set((state) => ({
                    coupons: state.coupons.map((c) => (c._id === id ? { ...c, ...updates } : c)),
                    isLoading: false,
                }));
                return { success: true };
            } else {
                set({ error: data.message, isLoading: false });
                return { success: false, message: data.message };
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, message: error.message };
        }
    },

    deleteCoupon: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/coupons/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                set((state) => ({
                    coupons: state.coupons.filter((c) => c._id !== id),
                    isLoading: false,
                }));
                return { success: true };
            } else {
                set({ error: 'Failed to delete coupon', isLoading: false });
                return { success: false };
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false };
        }
    },

    toggleCouponStatus: async (id, currentStatus) => {
        // Optimistic update
        set((state) => ({
            coupons: state.coupons.map((c) =>
                c._id === id ? { ...c, isActive: !currentStatus } : c
            ),
        }));

        try {
            const response = await fetch(`/api/coupons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (!response.ok) {
                // Revert on failure
                set((state) => ({
                    coupons: state.coupons.map((c) =>
                        c._id === id ? { ...c, isActive: currentStatus } : c
                    ),
                    error: 'Failed to update status',
                }));
            }
        } catch (error) {
            // Revert on failure
            set((state) => ({
                coupons: state.coupons.map((c) =>
                    c._id === id ? { ...c, isActive: currentStatus } : c
                ),
                error: error.message,
            }));
        }
    },
}));

export default useCouponStore;
