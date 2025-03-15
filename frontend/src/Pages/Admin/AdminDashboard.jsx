import React, { useState } from 'react';
import {
    BarChart3,
    ShoppingBag,
    Users,
    Package,
    Tag,
    Settings,
    LogOut,
    Bell,
    Search,
    TrendingUp,
    DollarSign,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Truck,
    Layers,
    Plus,
    Eye,
    Edit,
    Trash2,
    
} from 'lucide-react';
import AdminProductForm from './ProductForm';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showProductForm, setShowProductForm] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sample data
    const recentOrders = [
        { id: '#ORD-7462', customer: 'Emma Wilson', date: '15 Mar 2025', status: 'Delivered', total: '$129.99' },
        { id: '#ORD-7461', customer: 'Jason Brown', date: '14 Mar 2025', status: 'Processing', total: '$85.50' },
        { id: '#ORD-7460', customer: 'Sarah Thomas', date: '14 Mar 2025', status: 'Shipped', total: '$214.30' },
        { id: '#ORD-7459', customer: 'Michael Davis', date: '13 Mar 2025', status: 'Pending', total: '$59.99' },
    ];

    const topProducts = [
        { name: 'Classic White T-Shirt', sold: 324, stock: 156, price: '$24.99' },
        { name: 'Slim Fit Jeans', sold: 276, stock: 82, price: '$59.99' },
        { name: 'Summer Floral Dress', sold: 198, stock: 43, price: '$45.50' },
        { name: 'Casual Linen Blazer', sold: 182, stock: 27, price: '$89.99' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Canceled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Sample analytics data
    const salesData = {
        today: '$3,245',
        yesterday: '$2,890',
        growth: '+12.3%'
    };

    const ordersData = {
        today: 47,
        yesterday: 42,
        growth: '+11.9%'
    };

    const customersData = {
        today: 18,
        yesterday: 12,
        growth: '+50.0%'
    };

    const lowStockItems = 12;
    const pendingReturns = 5;
    const notifications = 3;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">FASHION ADMIN</h1>
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <BarChart3 className="w-5 h-5 mr-3" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <ShoppingBag className="w-5 h-5 mr-3" />
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <Package className="w-5 h-5 mr-3" />
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('customers')}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'customers' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <Users className="w-5 h-5 mr-3" />
                            Customers
                        </button>
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <Layers className="w-5 h-5 mr-3" />
                            Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'categories' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <Tag className="w-5 h-5 mr-3" />
                            Categories
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'shipping' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <Truck className="w-5 h-5 mr-3" />
                            Shipping
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
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
                    {isMenuOpen ?
                        <ChevronUp className="w-6 h-6 text-gray-700" /> :
                        <ChevronDown className="w-6 h-6 text-gray-700" />
                    }
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-4 z-20 w-48 bg-white rounded-md shadow-lg">
                    <div className="py-1">
                        <button
                            onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <BarChart3 className="w-5 h-5 mr-3" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => { setActiveTab('orders'); setIsMenuOpen(false); }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <ShoppingBag className="w-5 h-5 mr-3" />
                            Orders
                        </button>
                        <button
                            onClick={() => { setActiveTab('products'); setIsMenuOpen(false); }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Package className="w-5 h-5 mr-3" />
                            Products
                        </button>
                        <button
                            onClick={() => { setActiveTab('customers'); setIsMenuOpen(false); }}
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
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
                    <h2 className="text-lg font-medium md:hidden">FASHION ADMIN</h2>
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
                        <div className="relative">
                            <button className="p-1 text-gray-400 hover:text-gray-500">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <img
                                src="/api/placeholder/32/32"
                                alt="User avatar"
                                className="w-8 h-8 rounded-full bg-gray-300"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Admin User</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {activeTab === 'dashboard' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                                <div className="flex space-x-2">
                                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        Export
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
                                        Generate Report
                                    </button>
                                </div>
                            </div>

                            {/* Analytics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div className="p-6 bg-white rounded-lg shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Daily Sales</p>
                                            <p className="text-2xl font-bold text-gray-900">{salesData.today}</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-sm text-green-600 flex items-center">
                                                    <TrendingUp className="w-4 h-4 mr-1" />
                                                    {salesData.growth}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
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
                                            <p className="text-sm font-medium text-gray-600">Daily Orders</p>
                                            <p className="text-2xl font-bold text-gray-900">{ordersData.today}</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-sm text-green-600 flex items-center">
                                                    <TrendingUp className="w-4 h-4 mr-1" />
                                                    {ordersData.growth}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
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
                                            <p className="text-sm font-medium text-gray-600">New Customers</p>
                                            <p className="text-2xl font-bold text-gray-900">{customersData.today}</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-sm text-green-600 flex items-center">
                                                    <TrendingUp className="w-4 h-4 mr-1" />
                                                    {customersData.growth}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-green-100 rounded-full">
                                            <Users className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Alert Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                                        <div className="p-2 bg-yellow-100 rounded-full mr-4">
                                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-yellow-800">Low Stock Alert</p>
                                            <p className="text-sm text-yellow-600">{lowStockItems} items need reordering</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-full mr-4">
                                            <Truck className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-800">Shipping Update</p>
                                            <p className="text-sm text-blue-600">All orders are being processed on time</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center">
                                        <div className="p-2 bg-purple-100 rounded-full mr-4">
                                            <Package className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-purple-800">Returns</p>
                                            <p className="text-sm text-purple-600">{pendingReturns} pending return requests</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-white rounded-lg shadow mb-6">
                                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                        <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                                        <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
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
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {recentOrders.map((order) => (
                                                    <tr key={order.id}>
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
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
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
                                    </div>
                                </div>

                                {/* Top Products */}
                                <div className="bg-white rounded-lg shadow">
                                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                        <h2 className="text-lg font-medium text-gray-900">Top Selling Products</h2>
                                        <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Product
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Units Sold
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        In Stock
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Price
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {topProducts.map((product) => (
                                                    <tr key={product.name}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {product.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {product.sold}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            <span className={product.stock < 50 ? 'text-red-600 font-medium' : 'text-gray-700'}>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}           
                            {/* Other tabs content would go here */}
                            {activeTab === 'orders' && (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h1>
                                    {/* Orders tab content */}
                                    <div className="bg-white rounded-lg shadow">
                                        {/* Orders content would go here */}
                                        <div className="p-10 text-center text-gray-500">
                                            Orders content would be displayed here
                                        </div>
                                    </div>
                                </div>
                            )}

{activeTab === 'products' && (
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
            <AdminProductForm />
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: PROD-{1000 + index}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock} in stock</div>
                    <div className="text-sm text-gray-500">{product.sold} sold</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.stock > 50 ? 'bg-green-100 text-green-800' : 
                        product.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {product.stock > 50 ? 'In Stock' : 
                        product.stock > 10 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)}

                            {activeTab === 'customers' && (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Management</h1>
                                    {/* Customers tab content */}
                                    <div className="bg-white rounded-lg shadow">
                                        {/* Customers content would go here */}
                                        <div className="p-10 text-center text-gray-500">
                                            Customers content would be displayed here
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inventory' && (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory Management</h1>
                                    {/* Inventory tab content */}
                                    <div className="bg-white rounded-lg shadow">
                                        {/* Inventory content would go here */}
                                        <div className="p-10 text-center text-gray-500">
                                            Inventory content would be displayed here
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'categories' && (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories Management</h1>
                                    {/* Categories tab content */}
                                    <div className="bg-white rounded-lg shadow">
                                        {/* Categories content would go here */}
                                        <div className="p-10 text-center text-gray-500">
                                            Categories content would be displayed here
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'shipping' && (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Management</h1>
                                    {/* Shipping tab content */}
                                    <div className="bg-white rounded-lg shadow">
                                        {/* Shipping content would go here */}
                                        <div className="p-10 text-center text-gray-500">
                                            Shipping content would be displayed here
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
                                    {/* Settings tab content */}
                                    <div className="bg-white rounded-lg shadow">
                                        {/* Settings content would go here */}
                                        <div className="p-10 text-center text-gray-500">
                                            Settings content would be displayed here
                                        </div>
                                    </div>
                                </div>
                            )}
                        
                            
                        </main>
                    </div>
                    </div>
    )
};

export default AdminDashboard;