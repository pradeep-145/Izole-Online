import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  ShoppingCart, 
  Package, 
  Users, 
  Home, 
  Layers, 
  Tag, 
  Truck, 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  LogOut, 
  User, 
  HelpCircle,
  Moon,
  Sun 
} from 'lucide-react';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const notifications = [
    { id: 1, message: "New order #1234 received", time: "2 min ago", isRead: false },
    { id: 2, message: "Customer Jane Smith left a review", time: "1 hour ago", isRead: false },
    { id: 3, message: "Inventory low on product SKU-456", time: "3 hours ago", isRead: true },
    { id: 4, message: "Weekly sales report available", time: "1 day ago", isRead: true }
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-white shadow">
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <div className="font-semibold text-xl">Admin Dashboard</div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsNotificationPanelOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
          >
            JS
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:block w-64 border-r border-gray-200 bg-white">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full py-2 pl-8 pr-4 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 pl-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h2>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </button>
            
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ShoppingCart className="mr-3 h-4 w-4" />
              Orders
            </button>
            
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Package className="mr-3 h-4 w-4" />
              Products
            </button>
            
            <button 
              onClick={() => setActiveTab('customers')}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'customers' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Users className="mr-3 h-4 w-4" />
              Customers
            </button>
            
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Layers className="mr-3 h-4 w-4" />
              Inventory
            </button>
            
            <button 
              onClick={() => setActiveTab('categories')}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'categories' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Tag className="mr-3 h-4 w-4" />
              Categories
            </button>
            
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'shipping' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Truck className="mr-3 h-4 w-4" />
              Shipping
            </button>
          </nav>
          
          <h2 className="mt-8 mb-2 pl-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </button>
            
            <button className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100">
              <HelpCircle className="mr-3 h-4 w-4" />
              Help & Support
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 border-t border-gray-200">
          <div className="p-4 flex items-center justify-between">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                JS
              </div>
              
              <div className="ml-3 relative">
                <div>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex text-sm items-center focus:outline-none"
                  >
                    <span className="text-gray-700 text-sm font-medium">John Smith</span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </button>
                </div>
                
                {isProfileDropdownOpen && (
                  <div className="origin-bottom-right absolute right-0 bottom-12 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="mr-3 h-4 w-4" />
                        Your Profile
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="mr-3 h-4 w-4" />
                        Account Settings
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button 
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="h-16 flex items-center justify-center border-b border-gray-200">
              <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
            </div>
            
            <div className="p-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full py-2 pl-8 pr-4 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="px-3 py-2 flex-1 overflow-y-auto">
              <h2 className="mb-2 pl-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h2>
              <nav className="space-y-1">
                <button 
                  onClick={() => {setActiveTab('dashboard'); setIsMobileSidebarOpen(false);}}
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Home className="mr-3 h-4 w-4" />
                  Dashboard
                </button>
                
                {/* Repeat for all menu items */}
                <button 
                  onClick={() => {setActiveTab('orders'); setIsMobileSidebarOpen(false);}}
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ShoppingCart className="mr-3 h-4 w-4" />
                  Orders
                </button>
                
                <button 
                  onClick={() => {setActiveTab('products'); setIsMobileSidebarOpen(false);}}
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'products' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Package className="mr-3 h-4 w-4" />
                  Products
                </button>
                
                <button 
                  onClick={() => {setActiveTab('customers'); setIsMobileSidebarOpen(false);}}
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'customers' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Users className="mr-3 h-4 w-4" />
                  Customers
                </button>
                
                <button 
                 onClick={() => {setActiveTab('inventory'); setIsMobileSidebarOpen(false);}}
                 className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
               >
                 <Layers className="mr-3 h-4 w-4" />
                 Inventory
               </button>
               
               <button 
                 onClick={() => {setActiveTab('categories'); setIsMobileSidebarOpen(false);}}
                 className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'categories' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
               >
                 <Tag className="mr-3 h-4 w-4" />
                 Categories
               </button>
               
               <button 
                 onClick={() => {setActiveTab('shipping'); setIsMobileSidebarOpen(false);}}
                 className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'shipping' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
               >
                 <Truck className="mr-3 h-4 w-4" />
                 Shipping
               </button>
             </nav>
             
             <h2 className="mt-8 mb-2 pl-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
             <nav className="space-y-1">
               <button 
                 onClick={() => {setActiveTab('settings'); setIsMobileSidebarOpen(false);}}
                 className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
               >
                 <Settings className="mr-3 h-4 w-4" />
                 Settings
               </button>
               
               <button className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100">
                 <HelpCircle className="mr-3 h-4 w-4" />
                 Help & Support
               </button>
               
               <button className="flex items-center w-full px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-gray-100">
                 <LogOut className="mr-3 h-4 w-4" />
                 Sign out
               </button>
             </nav>
           </div>
         </div>
       </div>
     )}
     
     {/* Top navigation bar */}
     <div className="flex-1">
       <div className="hidden lg:flex h-16 justify-between items-center px-6 border-b border-gray-200">
         <div className="text-lg font-semibold text-gray-800">
           {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
         </div>
         
         <div className="flex items-center space-x-4">
           <button 
             onClick={toggleDarkMode}
             className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
           
           <div className="relative">
             <button 
               onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
               className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100"
             >
               <Bell size={20} />
               {notifications.some(n => !n.isRead) && (
                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
               )}
             </button>
             
             {isNotificationPanelOpen && (
               <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                 <div className="p-3 border-b border-gray-200">
                   <div className="flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                     <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                   </div>
                 </div>
                 <div className="max-h-80 overflow-y-auto">
                   {notifications.map(notification => (
                     <div key={notification.id} className={`p-4 border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                       <div className="flex items-start">
                         <div className="flex-shrink-0">
                           <div className={`w-2 h-2 mt-1 rounded-full ${!notification.isRead ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                         </div>
                         <div className="ml-3 w-full">
                           <p className="text-sm text-gray-800">{notification.message}</p>
                           <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="p-2 border-t border-gray-200">
                   <button className="w-full px-4 py-2 text-xs font-medium text-blue-600 hover:text-blue-800 text-center">
                     View all notifications
                   </button>
                 </div>
               </div>
             )}
           </div>
           
           <div className="relative">
             <button 
               onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
               className="flex items-center space-x-3 focus:outline-none"
             >
               <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                 JS
               </div>
               <div className="text-sm font-medium text-gray-700">John Smith</div>
               <ChevronDown className="h-4 w-4 text-gray-500" />
             </button>
             
             {isProfileDropdownOpen && (
               <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                 <div className="py-1">
                   <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                     <User className="mr-3 h-4 w-4" />
                     Your Profile
                   </a>
                   <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                     <Settings className="mr-3 h-4 w-4" />
                     Account Settings
                   </a>
                   <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                     <LogOut className="mr-3 h-4 w-4" />
                     Sign out
                   </a>
                 </div>
               </div>
             )}
           </div>
         </div>
       </div>
       
       {/* Main content area */}
       <div className="p-6">
         <div className="mt-8 lg:mt-0">
           {/* Your page content goes here */}
           <div className="text-center text-gray-500 text-lg">
             {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content Goes Here
           </div>
         </div>
       </div>
     </div>
     
     {/* Notification Sidebar for Mobile */}
     {isNotificationPanelOpen && (
       <div className="lg:hidden fixed inset-0 z-50 flex">
         <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsNotificationPanelOpen(false)}></div>
         <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white ml-auto">
           <div className="absolute top-0 left-0 -ml-12 pt-2">
             <button 
               className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
               onClick={() => setIsNotificationPanelOpen(false)}
             >
               <X className="h-6 w-6 text-white" />
             </button>
           </div>
           
           <div className="p-4 border-b border-gray-200 flex items-center justify-between">
             <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
             <button className="text-sm text-blue-600 hover:text-blue-800">Mark all as read</button>
           </div>
           
           <div className="flex-1 overflow-y-auto">
             {notifications.map(notification => (
               <div key={notification.id} className={`p-4 border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                 <div className="flex items-start">
                   <div className="flex-shrink-0">
                     <div className={`w-2 h-2 mt-1 rounded-full ${!notification.isRead ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                   </div>
                   <div className="ml-3 w-full">
                     <p className="text-sm text-gray-800">{notification.message}</p>
                     <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="p-4 border-t border-gray-200">
             <button className="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-800 text-center">
               View all notifications
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default Navbar;