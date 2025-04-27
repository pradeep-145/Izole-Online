import React, { useState } from 'react';
import { Box, Calendar, Clock, Package, ChevronRight, Truck, Check } from 'lucide-react';
import Navbar from '../../Components/customer/Navbar';

const OrderHistoryPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Sample order data
  const orders = [
    {
      id: 'IZ-12345',
      date: 'April 20, 2025',
      total: 249.97,
      status: 'Delivered',
      statusTimeline: [
        { status: 'Order Placed', date: 'April 15, 2025', completed: true },
        { status: 'Payment Confirmed', date: 'April 15, 2025', completed: true },
        { status: 'Processing', date: 'April 16, 2025', completed: true },
        { status: 'Shipped', date: 'April 17, 2025', completed: true },
        { status: 'Out for Delivery', date: 'April 19, 2025', completed: true },
        { status: 'Delivered', date: 'April 20, 2025', completed: true }
      ],
      items: [
        { name: 'Premium Wool Coat', size: 'M', color: 'Black', price: 149.99, quantity: 1, image: '/api/placeholder/80/100' },
        { name: 'Designer Jeans', size: '32', color: 'Dark Blue', price: 99.98, quantity: 1, image: '/api/placeholder/80/100' }
      ],
      shippingAddress: '123 Fashion Street, Style City, SC 12345',
      paymentMethod: 'Credit Card (ending in 4321)'
    },
    {
      id: 'IZ-12346',
      date: 'April 10, 2025',
      total: 185.95,
      status: 'Delivered',
      statusTimeline: [
        { status: 'Order Placed', date: 'April 5, 2025', completed: true },
        { status: 'Payment Confirmed', date: 'April 5, 2025', completed: true },
        { status: 'Processing', date: 'April 6, 2025', completed: true },
        { status: 'Shipped', date: 'April 7, 2025', completed: true },
        { status: 'Out for Delivery', date: 'April 9, 2025', completed: true },
        { status: 'Delivered', date: 'April 10, 2025', completed: true }
      ],
      items: [
        { name: 'Cashmere Sweater', size: 'L', color: 'Burgundy', price: 119.99, quantity: 1, image: '/api/placeholder/80/100' },
        { name: 'Canvas Belt', size: 'One Size', color: 'Tan', price: 35.99, quantity: 1, image: '/api/placeholder/80/100' },
        { name: 'Cotton Socks', size: 'M', color: 'Mixed', price: 29.97, quantity: 1, image: '/api/placeholder/80/100' }
      ],
      shippingAddress: '123 Fashion Street, Style City, SC 12345',
      paymentMethod: 'PayPal'
    },
    {
      id: 'IZ-12347',
      date: 'April 22, 2025',
      total: 349.99,
      status: 'In Transit',
      statusTimeline: [
        { status: 'Order Placed', date: 'April 21, 2025', completed: true },
        { status: 'Payment Confirmed', date: 'April 21, 2025', completed: true },
        { status: 'Processing', date: 'April 22, 2025', completed: true },
        { status: 'Shipped', date: 'April 22, 2025', completed: true },
        { status: 'Out for Delivery', date: 'April 24, 2025', completed: false },
        { status: 'Delivered', date: 'Expected April 25, 2025', completed: false }
      ],
      items: [
        { name: 'Designer Leather Jacket', size: 'M', color: 'Brown', price: 349.99, quantity: 1, image: '/api/placeholder/80/100' }
      ],
      shippingAddress: '123 Fashion Street, Style City, SC 12345',
      paymentMethod: 'Credit Card (ending in 4321)'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Order Placed':
        return <Calendar size={16} />;
      case 'Payment Confirmed':
        return <Check size={16} />;
      case 'Processing':
        return <Box size={16} />;
      case 'Shipped':
        return <Package size={16} />;
      case 'Out for Delivery':
        return <Truck size={16} />;
      case 'Delivered':
        return <Check size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
        return 'text-green-600';
      case 'In Transit':
        return 'text-blue-600';
      case 'Processing':
        return 'text-yellow-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
      <div>
      <Navbar/>
    <div className="max-w-6xl mx-auto p-6 lg:mt-28 bg-yellow-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-wineRed">Order History</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-4 text-wineRed">My Orders</h2>
            <div className="space-y-2">
              {orders.map(order => (
                <div
                  key={order.id}
                  className={`p-3 rounded-md cursor-pointer transition-all hover:bg-mustard flex justify-between items-center ${selectedOrder?.id === order.id ? 'bg-gray-100 border-l-4 border-wineRed ' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                    <p className={`text-sm font-medium  ${getStatusColor(order.status)}`}>{order.status}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="font-semibold text-wineRed mr-2">${order.total.toFixed(2)}</p>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          {selectedOrder ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-wineRed">Order {selectedOrder.id}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              
              {/* Order Timeline */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex text-wineRed items-center">
                  <Clock className="mr-2 text-[#FFC107]" size={18} /> Order Status
                </h3>
                <div className="relative">
                  {selectedOrder.statusTimeline.map((step, index) => (
                    <div key={index} className="flex mb-4 items-start">
                      <div className={`rounded-full h-6 w-6 flex items-center justify-center mr-3 ${step.completed ? 'bg-wineRed text-white' : 'bg-gray-200'}`}>
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.completed ? 'text-gray-800' : 'text-gray-300'}`}>{step.status}</p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                  {/* Timeline line */}
                  <div className="absolute top-0 left-3 w-px bg-gray-300 h-full -z-10 transform -translate-x-1/2"></div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-wineRed">
                  <Package className="mr-2 text-[#FFC107]" size={18} /> Items in this Order
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center p-3 border text-wineRed border-gray-200 rounded-md">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded mr-4" />
                      <div className="flex-1 text-wineRed">
                        <p className="font-medium">{item.name}</p>
                        <div className="text-sm text-gray-600">
                          <p>Size: {item.size} | Color: {item.color}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="font-semibold text-wineRed">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right mt-4 font-bold text-lg text-wineRed">
                  Total: ${selectedOrder.total.toFixed(2)}
                </div>
              </div>
              
              {/* Order Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex text-wineRed items-center">
                    <Truck className="mr-2 text-[#FFC107]" size={18} /> Shipping Details
                  </h3>
                  <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-wineRed flex items-center">
                    <Check className="mr-2 text-[#FFC107]" size={18} /> Payment Method
                  </h3>
                  <p className="text-gray-700">{selectedOrder.paymentMethod}</p>
                </div>
              </div>
              
              {/* <div className="mt-8 flex justify-end space-x-4">
                <button className="px-4 py-2 border border-[#8B0000] text-wineRed rounded-md hover:bg-gray-50">
                  Need Help?
                </button>
                <button className="px-4 py-2 bg-[#FFC107] text-white rounded-md hover:bg-amber-500">
                  Re-order Items
                </button>
              </div> */}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-full">
              <Package size={64} className="text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default OrderHistoryPage;