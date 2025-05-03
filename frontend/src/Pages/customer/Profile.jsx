import React, { useState, useEffect, useContext } from "react";
import { User, Edit2, Mail, Phone, MapPin, Upload, ShoppingBag, Heart, Shield, Clock, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Assuming AuthContext is in this path
import axios from "axios";
<<<<<<< HEAD
import { toast } from "react-toastify";
import { useOrders } from "../../zustand/useOrders"; // Assuming useOrders is in this path
import Navbar from "../../Components/customer/Navbar"; // Import the Navbar component

export default function CustomerProfile() {
  const { authUser } = useAuth();
  const currentUser = authUser || null;
  const [profile, setProfile] = useState(null);
=======
import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const {authUser}=useAuth();
  const [profile, setProfile] = useState(authUser);
>>>>>>> ab410befcb9450ebcad1ce5b93b517c5a1051194
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { orders } = useOrders();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState(orders || []);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      console.log(currentUser.phoneNumber);
      setLoading(true);
      // Use currentUser data from AuthContext if available
      if (currentUser) {
        setProfile(currentUser);
        setFormData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phoneNumber || "",
          address: currentUser.address || "",
          city: currentUser.city || "",
          zipCode: currentUser.zipCode || "",
          country: currentUser.country || "",
        });
        setAvatarPreview(currentUser.avatar || "");
        setLoading(false);
        return;
      }

      // Fallback to API call if needed
      const token = localStorage.getItem("token");
       } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem("token");
    
      setOrderHistory(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load order history");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="text-wineRed" size={24} />
          My Profile
        </h1>

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning("Image size should be less than 2MB");
        return;
      }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (avatar) {
        formDataToSend.append("avatar", avatar);
      }

      const response = await axios.put("/api/customer/profile", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setProfile(response.data.profile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    try {
      setPasswordLoading(true);
      const token = localStorage.getItem("token");
      
      await axios.post("/api/customer/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    // Redirect to home or login page handled by AuthContext
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-mustard"></span>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const renderProfileContent = () => (
    <div className="space-y-6">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support for assistance.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              rows="2"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="btn bg-mustard hover:bg-yellow-600 text-wineRed border-none"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: profile?.name || "",
                  email: profile?.email || "",
                  phone: profile?.phone || "",
                  address: profile?.address || "",
                  city: profile?.city || "",
                  zipCode: profile?.zipCode || "",
                  country: profile?.country || "",
                });
                setAvatar(null);
                setAvatarPreview(profile?.avatar || "");
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-white shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-1">
                <User size={16} className="text-mustard mr-2" />
                <span className="text-sm text-gray-500">Full Name</span>
              </div>
              <p className="text-gray-800 font-medium">{profile?.name || "Not provided"}</p>
            </div>
            
            <div className="card bg-white shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-1">
                <Mail size={16} className="text-mustard mr-2" />
                <span className="text-sm text-gray-500">Email</span>
              </div>
              <p className="text-gray-800 font-medium">{profile?.email}</p>
            </div>

            <div className="card bg-white shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-1">
                <Phone size={16} className="text-mustard mr-2" />
                <span className="text-sm text-gray-500">Phone</span>
              </div>
              <p className="text-gray-800 font-medium">{profile?.phoneNumber || "Not provided"}</p>
            </div>

            <div className="card bg-white shadow-sm p-4 border border-gray-100">
              <div className="flex items-center mb-1">
                <MapPin size={16} className="text-mustard mr-2" />
                <span className="text-sm text-gray-500">Address</span>
              </div>
              <p className="text-gray-800 font-medium">
                {profile?.address ? (
                  <>
                    {profile.address}
                    <br />
                    {profile.city && `${profile.city}, `}
                    {profile.zipCode && profile.zipCode}
                    {profile.country && <><br />{profile.country}</>}
                  </>
                ) : (
                  "Not provided"
                )}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="btn bg-mustard hover:bg-yellow-600 text-wineRed border-none"
            >
              <Edit2 size={16} className="mr-2" /> Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityContent = () => (
    <div className="card bg-white shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Change Password</h3>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input 
            type="password" 
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            type="password" 
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
            minLength="8"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
            className="input input-bordered w-full focus:border-yellow-400 focus:ring focus:ring-yellow-200"
            minLength="8"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn bg-mustard hover:bg-yellow-600 text-wineRed border-none"
          disabled={passwordLoading}
        >
          {passwordLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span> Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>

      <div className="divider my-8">Account Security</div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Shield size={20} className="text-mustard mr-3" />
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
          </div>
          <Link to="/customer/2fa-setup" className="btn btn-sm bg-white hover:bg-gray-100 text-gray-800">
            Setup
          </Link>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <LogOut size={20} className="text-mustard mr-3" />
            <div>
              <h4 className="font-medium">Sign Out Everywhere</h4>
              <p className="text-sm text-gray-600">Log out from all devices</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-sm bg-white hover:bg-gray-100 text-gray-800">
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  const renderOrdersContent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
      
      {ordersLoading ? (
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner loading-md text-mustard"></span>
        </div>
      ) : orderHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr key={order.id}>
                  <td>#{order.orderNumber || order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹{order.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      order.status === "delivered" ? "badge-success" :
                      order.status === "processing" ? "badge-warning" :
                      order.status === "cancelled" ? "badge-error" :
                      "badge-info"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/customer/orders/${order.id}`} className="btn btn-xs bg-mustard hover:bg-yellow-600 text-wineRed border-none">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <ShoppingBag size={40} className="mx-auto text-gray-400 mb-3" />
          <h3 className="font-medium text-lg mb-2">No Orders Yet</h3>
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn bg-mustard hover:bg-yellow-600 text-wineRed border-none">
            Start Shopping
          </Link>
        </div>
      )}
      
      {orderHistory.length > 0 && (
        <div className="text-center mt-4">
          <Link to="/customer/orders" className="btn btn-outline border-wineRed text-wineRed hover:bg-wineRed hover:text-white">
            View All Orders
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Navbar /> {/* Add the Navbar component at the top */}
      <div className="bg-gray-50 min-h-screen py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-mustard px-6 py-4">
                <h1 className="text-xl font-semibold text-wineRed">My Account</h1>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Sidebar */}
                  <div className="md:w-1/4">
                    <div className="flex flex-col items-center mb-6">
                      <div className="avatar">
                        <div className="w-24 h-24 rounded-full ring ring-mustard ring-offset-2">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Profile"
                              className="object-cover"
                            />
                          ) : (
                            <div className="bg-yellow-100 w-full h-full flex items-center justify-center">
                              <User size={40} className="text-mustard" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isEditing && (
                        <label className="flex items-center gap-2 text-yellow-600 cursor-pointer mt-3 btn btn-sm btn-outline">
                          <Upload size={16} />
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      )}
                      
                      <h2 className="text-xl font-semibold text-gray-800 mt-4">
                        {profile?.name}
                      </h2>
                      <p className="text-gray-600 text-sm">Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                    
                    <div className="tabs tabs-boxed flex mb-6 md:hidden">
                      <button 
                        className={`tab flex-1 ${activeTab === "profile" ? "tab-active bg-mustard text-wineRed" : ""}`}
                        onClick={() => setActiveTab("profile")}
                      >
                        Profile
                      </button>
                      <button 
                        className={`tab flex-1 ${activeTab === "security" ? "tab-active bg-mustard text-wineRed" : ""}`}
                        onClick={() => setActiveTab("security")}
                      >
                        Security
                      </button>
                      <button 
                        className={`tab flex-1 ${activeTab === "orders" ? "tab-active bg-mustard text-wineRed" : ""}`}
                        onClick={() => setActiveTab("orders")}
                      >
                        Orders
                      </button>
                    </div>
                    
                    <div className="menu bg-base-200 rounded-box p-2 hidden md:block">
                      <button
                        className={`flex items-center w-full p-3 ${
                          activeTab === "profile" ? "bg-mustard text-wineRed" : "hover:bg-base-300"
                        } rounded-lg transition-colors mb-1`}
                        onClick={() => setActiveTab("profile")}
                      >
                        <User size={18} className="mr-3" />
                        Profile Information
                      </button>
                      
                      <button
                        className={`flex items-center w-full p-3 ${
                          activeTab === "security" ? "bg-mustard text-wineRed" : "hover:bg-base-300"
                        } rounded-lg transition-colors mb-1`}
                        onClick={() => setActiveTab("security")}
                      >
                        <Shield size={18} className="mr-3" />
                        Security Settings
                      </button>
                      
                      <button
                        className={`flex items-center w-full p-3 ${
                          activeTab === "orders" ? "bg-mustard text-wineRed" : "hover:bg-base-300"
                        } rounded-lg transition-colors mb-1`}
                        onClick={() => setActiveTab("orders")}
                      >
                        <ShoppingBag size={18} className="mr-3" />
                        Order History
                      </button>
                      
                      <Link
                        to="/customer/wishlist"
                        className="flex items-center w-full p-3 hover:bg-base-300 rounded-lg transition-colors mb-1"
                      >
                        <Heart size={18} className="mr-3" />
                        My Wishlist
                      </Link>
                      
                      <div className="divider my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 hover:bg-base-300 text-error rounded-lg transition-colors"
                      >
                        <LogOut size={18} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="md:w-3/4">
                    <div className="card bg-base-100 shadow-sm border border-gray-100">
                      <div className="card-body">
                        {activeTab === "profile" && renderProfileContent()}
                        {activeTab === "security" && renderSecurityContent()}
                        {activeTab === "orders" && renderOrdersContent()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}