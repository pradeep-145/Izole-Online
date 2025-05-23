import axios from "axios";
import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Layers,
  LogOut,
  Package,
  Plus,
  Search,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CustomerManagement from "../../Components/admin/CustomerManagement";
import InventoryManagement from "../../Components/admin/InventoryManagement";
import NotificationManagement from "../../Components/admin/NotificationManagement";
import OrderManagement from "../../Components/admin/OrderManagement";
import ProductTable from "../../Components/admin/ProductTable";
import ShippingManagement from "../../Components/admin/ShippingManagement";
import { useProduct } from "../../zustand/useProducts.jsx";
import AdminProductForm from "./ProductForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProductForm, setShowProductForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    sales: { today: "₹0", yesterday: "₹0", growth: "0%" },
    orders: { today: 0, yesterday: 0, growth: "0%" },
    customers: { today: 0, yesterday: 0, growth: "0%" },
    lowStockCount: 0,
    pendingReturns: 0,
    notifications: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshRate, setRefreshRate] = useState(60000); // 60 seconds by default
  const { products } = useProduct();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportParameters, setReportParameters] = useState({
    reportType: "sales",
    timePeriod: "last30",
    format: "csv", // Default to CSV only
    startDate: "",
    endDate: "",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle report parameter changes
  const handleReportParameterChange = (e) => {
    const { name, value } = e.target;
    setReportParameters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const response = await axios.get(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/inventory",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setInventory(response.data.inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/orders/update",
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      fetchOrders(); // Refresh orders after update
      if (activeTab === "dashboard") {
        fetchAnalyticsData(); // Also refresh dashboard data when order status changes
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Fetch dashboard analytics data - memoized with useCallback
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoadingAnalytics(true);
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            timestamp: new Date().getTime(), // Add cache-busting parameter
          },
        }
      );

      const data = response.data;

      setAnalyticsData({
        sales: {
          today: `₹${data.sales.today.toFixed(2)}`,
          yesterday: `₹${data.sales.yesterday.toFixed(2)}`,
          growth: `${
            data.sales.growth > 0 ? "+" : ""
          }${data.sales.growth.toFixed(1)}%`,
        },
        orders: {
          today: data.orders.today,
          yesterday: data.orders.yesterday,
          growth: `${
            data.orders.growth > 0 ? "+" : ""
          }${data.orders.growth.toFixed(1)}%`,
        },
        customers: {
          today: data.customers.today,
          yesterday: data.customers.yesterday,
          growth: `${
            data.customers.growth > 0 ? "+" : ""
          }${data.customers.growth.toFixed(1)}%`,
        },
        lowStockCount: data.lowStockCount || 0,
        pendingReturns: data.pendingReturns || 0,
        notifications: data.notifications || 0,
        rawData: data, // Store raw data for reporting
      });

      setRecentOrders(
        data.recentOrders.map((order) => ({
          id: `#${order.orderNumber || order._id.substring(0, 8)}`,
          customer: `${order.customer?.name || "Guest User"}`,
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          total: `₹${order.totalAmount.toFixed(2)}`,
        }))
      );

      setTopProducts(
        data.topProducts.map((product) => ({
          name: product.name,
          sold: product.totalSold || 0,
          stock: product.stock || 0,
          price: `₹${product.price.toFixed(2)}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      // Use fallback data if API fails
      setAnalyticsData({
        sales: { today: "₹0", yesterday: "₹0", growth: "0%" },
        orders: { today: 0, yesterday: 0, growth: "0%" },
        customers: { today: 0, yesterday: 0, growth: "0%" },
        lowStockCount: 0,
        pendingReturns: 0,
        notifications: 0,
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  // Updated function for generating reports with CSV format only
  const generateReport = async () => {
    setIsLoadingAnalytics(true);

    try {
      // Build query parameters based on selections
      const queryParams = new URLSearchParams();
      queryParams.append("reportType", reportParameters.reportType);
      queryParams.append("format", "csv"); // Hardcoded to CSV format

      if (reportParameters.timePeriod === "custom") {
        queryParams.append("startDate", reportParameters.startDate);
        queryParams.append("endDate", reportParameters.endDate);
      } else {
        queryParams.append("timePeriod", reportParameters.timePeriod);
      }

      // Make API request to generate report
      const response = await axios.get(
        `https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/reports/generate?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          responseType: "text", // Changed to text for CSV
        }
      );

      // Create a download link for the CSV
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${reportParameters.reportType}-report-${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Close the modal after successful generation
      setShowReportModal(false);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Add this useEffect to handle closing dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close notifications and profile dropdowns when clicking outside
      if (notificationOpen || profileOpen) {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    }

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationOpen, profileOpen]);

  // Setup real-time data refresh
  useEffect(() => {
    // Clear existing interval when component unmounts or autoRefresh changes
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    // Set up new interval if autoRefresh is enabled
    if (autoRefresh && activeTab === "dashboard") {
      const interval = setInterval(() => {
        if (document.visibilityState === "visible") {
          fetchAnalyticsData();
        }
      }, refreshRate);
      setRefreshInterval(interval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, activeTab, refreshRate, fetchAnalyticsData]);

  // Listen for visibility changes to pause refresh when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        autoRefresh &&
        activeTab === "dashboard"
      ) {
        fetchAnalyticsData(); // Refresh immediately when tab becomes visible
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoRefresh, activeTab, fetchAnalyticsData]);

  useEffect(() => {
    if (activeTab === "inventory") fetchInventory();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "dashboard") fetchAnalyticsData();
  }, [activeTab, fetchAnalyticsData]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-yellow-50 border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-black">IZOLE ADMIN</h1>
        </div>
        <div className="flex flex-col flex-1 ">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                activeTab === "dashboard"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                activeTab === "orders"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              Orders
              {analyticsData.notifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {analyticsData.notifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                activeTab === "products"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Package className="w-5 h-5 mr-3" />
              Products
              {analyticsData.lowStockCount > 0 && (
                <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {analyticsData.lowStockCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                activeTab === "customers"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              Customers
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                activeTab === "inventory"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Layers className="w-5 h-5 mr-3" />
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                activeTab === "shipping"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Truck className="w-5 h-5 mr-3" />
              Shipping
              {analyticsData.pendingReturns > 0 && (
                <span className="ml-auto bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {analyticsData.pendingReturns}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                activeTab === "notifications"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
              {analyticsData.notifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {analyticsData.notifications}
                </span>
              )}
            </button>
          </nav>
          <div className="px-4 py-2 mt-auto border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-20">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isMenuOpen ? (
            <ChevronUp className="w-6 h-6 text-gray-700" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-4 z-20 w-48 bg-white rounded-md shadow-lg">
          <div className="py-1">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab("orders");
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              Orders
            </button>
            <button
              onClick={() => {
                setActiveTab("products");
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Package className="w-5 h-5 mr-3" />
              Products
            </button>
            <button
              onClick={() => {
                setActiveTab("customers");
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Users className="w-5 h-5 mr-3" />
              Customers
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-16 px-6 bg-yellow-50 shadow-2xl border-gray-200">
          <div className="relative w-full max-w-md hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center space-x-4">
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-1 text-gray-400 hover:text-gray-500 relative"
              >
                <Bell className="w-6 h-6" />
                {analyticsData.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {analyticsData.notifications}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      Notifications
                    </h3>
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 ">
                    <div className="px-4 py-3 border-b border-gray-100 bg-blue-50">
                      <div className="flex items-start">
                        <ShoppingBag className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            New order received
                          </p>
                          <p className="text-xs text-gray-500">
                            Order #ORD-7462 from Emma Wilson
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            2 minutes ago
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-start">
                        <Layers className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Low stock alert
                          </p>
                          <p className="text-xs text-gray-500">
                            Casual Linen Blazer is running low
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-start">
                        <Package className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Return request
                          </p>
                          <p className="text-xs text-gray-500">
                            Jason Brown requested a return
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            3 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-center bg-gray-50">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src="https://avatar.iran.liara.run/public/boy?username=admin"
                  alt="User avatar"
                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  Admin User
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {/* Profile Dropdown Panel */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      admin@fashionstore.com
                    </p>
                  </div>
                  <div className="py-1">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <Users className="w-4 h-4 mr-3 text-gray-500" />
                      My Profile
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut className="w-4 h-4 mr-3 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === "dashboard" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <div className="flex space-x-2">
                  <div className="flex items-center mr-4">
                    <input
                      id="autoRefresh"
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={toggleAutoRefresh}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="autoRefresh"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Auto-refresh {autoRefresh ? "(on)" : "(off)"}
                    </label>
                  </div>

                  <button
                    onClick={() => setShowReportModal(true)}
                    className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    Generate Report
                  </button>
                </div>
              </div>

              {/* Real-time update indicator */}
              <div className="mb-4 flex items-center">
                <div
                  className={`h-2 w-2 rounded-full mr-2 ${
                    autoRefresh ? "bg-green-500 animate-pulse" : "bg-gray-300"
                  }`}
                ></div>
                <span className="text-xs text-gray-500">
                  {autoRefresh
                    ? `Real-time updates active. Last updated: ${new Date().toLocaleTimeString()}`
                    : "Real-time updates disabled"}
                </span>
                <button
                  onClick={fetchAnalyticsData}
                  className="ml-2 text-xs text-blue-600 hover:underline"
                  disabled={isLoadingAnalytics}
                >
                  Refresh now
                </button>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="p-6 bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Daily Sales
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analyticsData.sales.today}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-sm flex items-center ${
                            analyticsData.sales.growth.startsWith("+")
                              ? "text-green-600"
                              : analyticsData.sales.growth === "0%"
                              ? "text-gray-600"
                              : "text-red-600"
                          }`}
                        >
                          {analyticsData.sales.growth.startsWith("+") ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : analyticsData.sales.growth === "0%" ? (
                            <span className="w-4 h-4 mr-1">→</span>
                          ) : (
                            <ChevronDown className="w-4 h-4 mr-1" />
                          )}
                          {analyticsData.sales.growth}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          vs yesterday
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Daily Orders
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analyticsData.orders.today}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-sm flex items-center ${
                            analyticsData.orders.growth.startsWith("+")
                              ? "text-green-600"
                              : analyticsData.orders.growth === "0%"
                              ? "text-gray-600"
                              : "text-red-600"
                          }`}
                        >
                          {analyticsData.orders.growth.startsWith("+") ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : analyticsData.orders.growth === "0%" ? (
                            <span className="w-4 h-4 mr-1">→</span>
                          ) : (
                            <ChevronDown className="w-4 h-4 mr-1" />
                          )}
                          {analyticsData.orders.growth}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          vs yesterday
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <ShoppingBag className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        New Customers
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analyticsData.customers.today}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-sm flex items-center ${
                            analyticsData.customers.growth.startsWith("+")
                              ? "text-green-600"
                              : analyticsData.customers.growth === "0%"
                              ? "text-gray-600"
                              : "text-red-600"
                          }`}
                        >
                          {analyticsData.customers.growth.startsWith("+") ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : analyticsData.customers.growth === "0%" ? (
                            <span className="w-4 h-4 mr-1">→</span>
                          ) : (
                            <ChevronDown className="w-4 h-4 mr-1" />
                          )}
                          {analyticsData.customers.growth}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          vs yesterday
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow mb-6 ">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center h-20">
                    <h2 className="text-lg font-medium text-gray-900">
                      Recent Orders
                    </h2>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto h-[500px] overflow-y-scroll scrollbar-hide">
                    {isLoadingAnalytics ? (
                      <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-gray-500">Loading orders...</p>
                      </div>
                    ) : recentOrders.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Order ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Customer
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentOrders.map((order, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {order.customer}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {order.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {order.total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">No recent orders found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                      Top Selling Products
                    </h2>
                    <button
                      onClick={() => setActiveTab("products")}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    {isLoadingAnalytics ? (
                      <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-gray-500">Loading products...</p>
                      </div>
                    ) : topProducts.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Product
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Units Sold
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              In Stock
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {topProducts.map((product, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {product.sold}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <span
                                  className={
                                    product.stock < 50
                                      ? "text-red-600 font-medium"
                                      : "text-gray-700"
                                  }
                                >
                                  {product.stock}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {product.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">No top products found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Other tabs content would go here */}
          {activeTab === "orders" && (
            <div>
              <OrderManagement />
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
              </div>

              {showProductForm ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="text-xl font-bold">Add New Product</h2>
                      <button
                        onClick={() => setShowProductForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ChevronUp className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="p-4">
                      <AdminProductForm
                        onSuccess={() => setShowProductForm(false)}
                      />{" "}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <ProductTable />
                </div>
              )}
            </div>
          )}

          {activeTab === "customers" && (
            <div>
              <CustomerManagement />
            </div>
          )}

          {activeTab === "inventory" && (
            <div>
              <InventoryManagement />
            </div>
          )}

          {activeTab === "shipping" && (
            <div>
              <ShippingManagement />
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
              </div>
              <NotificationManagement />
            </div>
          )}
        </main>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-900">
                  Generate Report
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  name="reportType"
                  value={reportParameters.reportType}
                  onChange={handleReportParameterChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sales">Sales Report</option>
                  <option value="inventory">Inventory Report</option>
                  <option value="customers">Customer Activity</option>
                  <option value="orders">Order Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <select
                  name="timePeriod"
                  value={reportParameters.timePeriod}
                  onChange={handleReportParameterChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {reportParameters.timePeriod === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={reportParameters.startDate}
                      onChange={handleReportParameterChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={reportParameters.endDate}
                      onChange={handleReportParameterChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Report will be generated in CSV format
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={generateReport}
                disabled={
                  isLoadingAnalytics ||
                  (reportParameters.timePeriod === "custom" &&
                    (!reportParameters.startDate || !reportParameters.endDate))
                }
                className={`px-4 py-2 rounded-md text-sm font-medium text-white flex items-center ${
                  isLoadingAnalytics ||
                  (reportParameters.timePeriod === "custom" &&
                    (!reportParameters.startDate || !reportParameters.endDate))
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoadingAnalytics ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>Generate</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
