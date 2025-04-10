import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ChevronDown,
  Search,
  Filter,
  Printer,
  Download,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Package,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  XCircle,
  FileText,
  Clipboard,
  ExternalLink
} from 'lucide-react';

const OrderManagement = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // Fetch orders - this would integrate with your API
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setOrders(sampleOrders);
      setPageLoading(false);
    }, 1000);
  }, []);

  // Sample data - replace with actual API data
  const sampleOrders = [
    {
      id: 'ORD-7462',
      customerName: 'Emma Wilson',
      customerEmail: 'emma.wilson@example.com',
      date: '15 Mar 2025',
      status: 'Delivered',
      total: 129.99,
      paymentMethod: 'Credit Card',
      items: [
        { id: 'ITEM-1', name: 'Classic White T-Shirt', qty: 2, price: 24.99, size: 'M', color: 'White' },
        { id: 'ITEM-2', name: 'Slim Fit Jeans', qty: 1, price: 79.99, size: '32', color: 'Blue' }
      ],
      shippingAddress: {
        name: 'Emma Wilson',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      shipment: {
        trackingId: 'SP123456789',
        carrier: 'DHL Express',
        dispatchDate: '13 Mar 2025',
        estimatedDelivery: '15 Mar 2025',
        actualDelivery: '15 Mar 2025',
        status: 'Delivered'
      }
    },
    {
      id: 'ORD-7461',
      customerName: 'Jason Brown',
      customerEmail: 'jason.brown@example.com',
      date: '14 Mar 2025',
      status: 'Processing',
      total: 85.50,
      paymentMethod: 'PayPal',
      items: [
        { id: 'ITEM-3', name: 'Summer Floral Dress', qty: 1, price: 45.50, size: 'S', color: 'Floral Print' },
        { id: 'ITEM-4', name: 'Canvas Tote Bag', qty: 1, price: 39.99, size: 'One Size', color: 'Beige' }
      ],
      shippingAddress: {
        name: 'Jason Brown',
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'USA'
      },
      shipment: null
    },
    {
      id: 'ORD-7460',
      customerName: 'Sarah Thomas',
      customerEmail: 'sarah.thomas@example.com',
      date: '14 Mar 2025',
      status: 'Shipped',
      total: 214.30,
      paymentMethod: 'Credit Card',
      items: [
        { id: 'ITEM-5', name: 'Casual Linen Blazer', qty: 1, price: 89.99, size: 'L', color: 'Navy' },
        { id: 'ITEM-6', name: 'Silk Blouse', qty: 2, price: 62.15, size: 'M', color: 'Ivory' }
      ],
      shippingAddress: {
        name: 'Sarah Thomas',
        street: '789 Pine Street',
        city: 'Chicago',
        state: 'IL',
        zip: '60007',
        country: 'USA'
      },
      shipment: {
        trackingId: 'SP987654321',
        carrier: 'FedEx',
        dispatchDate: '14 Mar 2025',
        estimatedDelivery: '16 Mar 2025',
        actualDelivery: null,
        status: 'In Transit'
      }
    },
    {
      id: 'ORD-7459',
      customerName: 'Michael Davis',
      customerEmail: 'michael.davis@example.com',
      date: '13 Mar 2025',
      status: 'Pending',
      total: 59.99,
      paymentMethod: 'Apple Pay',
      items: [
        { id: 'ITEM-7', name: 'Slim Fit Jeans', qty: 1, price: 59.99, size: '34', color: 'Black' }
      ],
      shippingAddress: {
        name: 'Michael Davis',
        street: '321 Elm Road',
        city: 'Houston',
        state: 'TX',
        zip: '77001',
        country: 'USA'
      },
      shipment: null
    },
    {
      id: 'ORD-7458',
      customerName: 'Alex Johnson',
      customerEmail: 'alex.johnson@example.com',
      date: '12 Mar 2025',
      status: 'Canceled',
      total: 148.75,
      paymentMethod: 'Credit Card',
      items: [
        { id: 'ITEM-8', name: 'Winter Parka', qty: 1, price: 129.99, size: 'XL', color: 'Olive' },
        { id: 'ITEM-9', name: 'Wool Beanie', qty: 1, price: 18.75, size: 'One Size', color: 'Grey' }
      ],
      shippingAddress: {
        name: 'Alex Johnson',
        street: '555 Park Avenue',
        city: 'Boston',
        state: 'MA',
        zip: '02108',
        country: 'USA'
      },
      shipment: null
    },
    {
      id: 'ORD-7457',
      customerName: 'Lisa Wong',
      customerEmail: 'lisa.wong@example.com',
      date: '11 Mar 2025',
      status: 'Returned',
      total: 84.98,
      paymentMethod: 'PayPal',
      items: [
        { id: 'ITEM-10', name: 'Classic White T-Shirt', qty: 2, price: 24.99, size: 'S', color: 'White' },
        { id: 'ITEM-11', name: 'Canvas Sneakers', qty: 1, price: 34.99, size: '7', color: 'White' }
      ],
      shippingAddress: {
        name: 'Lisa Wong',
        street: '888 River Drive',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        country: 'USA'
      },
      shipment: {
        trackingId: 'SP567891234',
        carrier: 'UPS',
        dispatchDate: '12 Mar 2025',
        estimatedDelivery: '14 Mar 2025',
        actualDelivery: '14 Mar 2025',
        returnDate: '16 Mar 2025',
        returnReason: 'Wrong size',
        status: 'Returned'
      }
    }
  ];

  // Handle checkbox selection
  const toggleOrderSelection = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Toggle select all orders
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
    setAllSelected(!allSelected);
  };

  // Filter orders based on tab, search, and filters
  const filteredOrders = orders.filter(order => {
    // Filter by tab
    if (activeTab !== 'all' && order.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && 
       !order.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
       !order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
       !order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && order.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    // Filter by date (simplified - would need proper date logic)
    if (dateFilter !== 'all') {
      // This would be expanded with proper date filtering logic
      const orderDate = new Date(order.date);
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

  // Get counts for each status
  const getStatusCount = (status) => {
    return orders.filter(order => 
      status === 'all' ? true : order.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  // Get color for status badge
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate ShipRocket shipment (mock function)
  const generateShipment = async (orderId) => {
    try {
      // This would be an API call to ShipRocket
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      setCurrentOrder(order);
      setLoadingTracking(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      const mockTrackingResponse = {
        trackingId: `SP${Math.floor(Math.random() * 900000000) + 100000000}`,
        shipmentId: Math.floor(Math.random() * 90000) + 10000,
        carrier: 'DTDC Express',
        estimatedDelivery: '18 Mar 2025',
        labelUrl: '#',
        status: 'Ready to Ship'
      };
      
      setTrackingInfo(mockTrackingResponse);
      setLoadingTracking(false);
      setIsShipmentModalOpen(true);
      
      // In a real implementation, we would update the order in the database
      
    } catch (error) {
      console.error("Error generating shipment:", error);
      setLoadingTracking(false);
      // Handle error appropriately
    }
  };

  // Update order status (mock function)
  const updateOrderStatus = (orderId, newStatus) => {
    // This would be an API call to your backend
    setOrders(orders.map(order => 
      order.id === orderId 
        ? {...order, status: newStatus} 
        : order
    ));
  };

  // Get tracking details from ShipRocket (mock function)
  const getTrackingDetails = async (trackingId) => {
    try {
      // This would be an API call to ShipRocket
      setLoadingTracking(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock tracking details
      const mockTracking = {
        trackingId: trackingId,
        carrier: 'DTDC Express',
        currentStatus: 'In Transit',
        estimatedDelivery: '18 Mar 2025',
        trackingUrl: 'https://shiprocket.co/tracking',
        updates: [
          { date: '15 Mar 2025 14:30', status: 'Package picked up', location: 'Warehouse' },
          { date: '15 Mar 2025 18:45', status: 'In Transit', location: 'Distribution Center' }
        ]
      };
      
      setTrackingInfo(mockTracking);
      setLoadingTracking(false);
      
    } catch (error) {
      console.error("Error fetching tracking details:", error);
      setLoadingTracking(false);
      // Handle error appropriately
    }
  };

// Bulk action handler
const handleBulkAction = (action) => {
    // This would integrate with your API for bulk operations
    switch (action) {
      case 'ship':
        // Logic to ship multiple orders
        alert(`Shipping ${selectedOrders.length} orders`);
        break;
      case 'export':
        // Logic to export orders to CSV/PDF
        alert(`Exporting ${selectedOrders.length} orders`);
        break;
      case 'delete':
        // Logic to delete selected orders
        setOrders(orders.filter(order => !selectedOrders.includes(order.id)));
        setSelectedOrders([]);
        break;
      case 'status':
        // Logic to update status of multiple orders
        // This would typically open a modal for status selection
        alert(`Update status for ${selectedOrders.length} orders`);
        break;
      default:
        break;
    }
  };

  // UI Components
  
  // Shipment Modal
  const ShipmentModal = () => {
    if (!currentOrder) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Shipment Details: {currentOrder.id}</h3>
            <button 
              onClick={() => setIsShipmentModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={20} />
            </button>
          </div>
          
          <div className="p-6">
            {loadingTracking ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw size={32} className="text-blue-600 animate-spin" />
                <p className="mt-4 text-gray-600">Generating shipment...</p>
              </div>
            ) : trackingInfo ? (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle size={20} className="text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Shipment created successfully!</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Shipment Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking ID:</span>
                        <span className="font-medium">{trackingInfo.trackingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carrier:</span>
                        <span>{trackingInfo.carrier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span>{trackingInfo.status || trackingInfo.currentStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Delivery:</span>
                        <span>{trackingInfo.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Shipping Address</h4>
                    <div className="text-gray-700">
                      <p>{currentOrder.shippingAddress.name}</p>
                      <p>{currentOrder.shippingAddress.street}</p>
                      <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zip}</p>
                      <p>{currentOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
                
                {trackingInfo.updates && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Tracking Updates</h4>
                    <div className="border rounded-lg divide-y">
                      {trackingInfo.updates.map((update, idx) => (
                        <div key={idx} className="p-3 flex items-start">
                          <div className="mr-3 mt-1">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{update.status}</p>
                            <p className="text-sm text-gray-500">{update.date} - {update.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex flex-wrap gap-3">
                  {trackingInfo.labelUrl && (
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
                      <Printer size={16} className="mr-2" />
                      Print Label
                    </button>
                  )}
                  
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
                    <Download size={16} className="mr-2" />
                    Download Invoice
                  </button>
                  
                  {trackingInfo.trackingUrl && (
                    <a 
                      href={trackingInfo.trackingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Track Package
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tracking information available
              </div>
            )}
          </div>
          
          <div className="p-4 border-t flex justify-end">
            <button 
              onClick={() => setIsShipmentModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the main component
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
              <Package size={16} className="mr-2" />
              Create Order
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Order stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div 
            className={`bg-white p-4 rounded-lg border ${activeTab === 'all' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
            onClick={() => setActiveTab('all')}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500">All Orders</span>
              <ShoppingBag size={18} className="text-gray-400" />
            </div>
            <p className="text-2xl font-semibold mt-2">{getStatusCount('all')}</p>
          </div>
          
          <div 
            className={`bg-white p-4 rounded-lg border ${activeTab === 'pending' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
            onClick={() => setActiveTab('pending')}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Pending</span>
              <Clock size={18} className="text-yellow-500" />
            </div>
            <p className="text-2xl font-semibold mt-2">{getStatusCount('pending')}</p>
          </div>
          
          <div 
            className={`bg-white p-4 rounded-lg border ${activeTab === 'processing' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
            onClick={() => setActiveTab('processing')}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Processing</span>
              <TrendingUp size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-semibold mt-2">{getStatusCount('processing')}</p>
          </div>
          
          <div 
            className={`bg-white p-4 rounded-lg border ${activeTab === 'shipped' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
            onClick={() => setActiveTab('shipped')}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Shipped</span>
              <Truck size={18} className="text-purple-500" />
            </div>
            <p className="text-2xl font-semibold mt-2">{getStatusCount('shipped')}</p>
          </div>
          
          <div 
            className={`bg-white p-4 rounded-lg border ${activeTab === 'delivered' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
            onClick={() => setActiveTab('delivered')}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Delivered</span>
              <CheckCircle size={18} className="text-green-500" />
            </div>
            <p className="text-2xl font-semibold mt-2">{getStatusCount('delivered')}</p>
          </div>
          
          <div 
            className={`bg-white p-4 rounded-lg border ${activeTab === 'canceled' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
            onClick={() => setActiveTab('canceled')}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Canceled</span>
              <AlertCircle size={18} className="text-red-500" />
            </div>
            <p className="text-2xl font-semibold mt-2">{getStatusCount('canceled') + getStatusCount('returned')}</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="mr-2" />
                Filters
                <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </button>
              
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download size={16} className="mr-2" />
                Export
              </button>
              
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Printer size={16} className="mr-2" />
                Print
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select 
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                  <option value="returned">Returned</option>
                  </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <select 
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="thisMonth">This Month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">All Methods</option>
                  <option value="creditCard">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="applePay">Apple Pay</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {pageLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw size={32} className="text-blue-600 animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found matching your criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            checked={allSelected}
                            onChange={toggleSelectAll}
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => toggleOrderSelection(order.id)}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye size={18} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit size={18} />
                            </button>
                            {(order.status === 'Pending' || order.status === 'Processing') && (
                              <button 
                                className="text-green-600 hover:text-green-900"
                                onClick={() => generateShipment(order.id)}
                              >
                                <Truck size={18} />
                              </button>
                            )}
                            {order.status === 'Shipped' && (
                              <button 
                                className="text-purple-600 hover:text-purple-900"
                                onClick={() => order.shipment && getTrackingDetails(order.shipment.trackingId)}
                              >
                                <FileText size={18} />
                              </button>
                            )}
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                      <span className="font-medium">{filteredOrders.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Shipment Modal */}
      {isShipmentModalOpen && <ShipmentModal />}
    </div>
  );
};

export default OrderManagement;