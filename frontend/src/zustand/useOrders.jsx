// store/useOrders.js
import { create } from 'zustand';
import axios from 'axios';

export const useOrders = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  activeTab: 'all',
  searchQuery: '',
  statusFilter: 'all',
  dateFilter: 'all',
  selectedOrders: [],
  allSelected: false,

  // Fetch orders
  fetchOrders: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get('/api/orders');
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.patch(`/api/orders/${orderId}/status`, { status });
      if (response.data) {
        const updatedOrders = get().orders.map(order => 
          order._id === orderId ? { ...order, status } : order
        );
        set({ orders: updatedOrders });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (orderId, delivery) => {
    try {
      const response = await axios.patch(`/api/orders/${orderId}/delivery`, { delivery });
      if (response.data) {
        const updatedOrders = get().orders.map(order => 
          order._id === orderId ? { ...order, delivery } : order
        );
        set({ orders: updatedOrders });
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  },

  // Set active tab
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Set search query
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Set status filter
  setStatusFilter: (status) => set({ statusFilter: status }),

  // Set date filter
  setDateFilter: (date) => set({ dateFilter: date }),

  // Toggle order selection
  toggleOrderSelection: (orderId) => {
    const { selectedOrders } = get();
    if (selectedOrders.includes(orderId)) {
      set({ selectedOrders: selectedOrders.filter(id => id !== orderId) });
    } else {
      set({ selectedOrders: [...selectedOrders, orderId] });
    }
  },

  // Toggle select all
  toggleSelectAll: (filteredOrders) => {
    const { allSelected } = get();
    if (allSelected) {
      set({ selectedOrders: [], allSelected: false });
    } else {
      set({ 
        selectedOrders: filteredOrders.map(order => order._id), 
        allSelected: true 
      });
    }
  },

  // Get filtered orders
  getFilteredOrders: () => {
    const { orders, activeTab, searchQuery, statusFilter, dateFilter } = get();
    
    return orders.filter(order => {
      // Filter by tab
      if (activeTab !== 'all' && order.status.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }
      
      // Filter by search
      if (searchQuery && 
         !order._id.toLowerCase().includes(searchQuery.toLowerCase()) && 
         !order.productId.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by status
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      
      // Filter by date
      if (dateFilter !== 'all') {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === today.toDateString();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return orderDate.toDateString() === yesterday.toDateString();
          case 'last7days':
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);
            return orderDate >= lastWeek;
          case 'thisMonth':
            return orderDate.getMonth() === today.getMonth() && 
                   orderDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      }
      
      return true;
    });
  },

  // Get status count
  getStatusCount: (status) => {
    const { orders } = get();
    return orders.filter(order => 
      status === 'all' ? true : order.status.toLowerCase() === status.toLowerCase()
    ).length;
  }
}));
