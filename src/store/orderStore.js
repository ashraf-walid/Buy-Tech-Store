import { create } from 'zustand';

const useOrderStore = create((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,
    hasFetched: false,

    fetchOrders: async (force = false) => {
        const { hasFetched, isLoading } = get();
        if ((hasFetched && !force) || isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/orders');
            if (response.ok) {
                const data = await response.json();
                const ordersData = data.data.map(order => ({
                    ...order,
                    id: order._id
                }));
                set({ orders: ordersData, hasFetched: true, isLoading: false });
            } else {
                set({ error: 'Failed to fetch orders', isLoading: false });
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateOrderStatus: async (orderId, status) => {
        // Optimistic update
        set((state) => ({
            orders: state.orders.map(order =>
                order.id === orderId ? { ...order, status } : order
            )
        }));

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                // Revert on failure (requires keeping previous state or refetching)
                // For simplicity, we'll just refetch or log error, but ideally we revert
                console.error('Failed to update order status');
                get().fetchOrders(true); // Re-fetch to sync with server
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            get().fetchOrders(true);
        }
    },
}));

export default useOrderStore;
