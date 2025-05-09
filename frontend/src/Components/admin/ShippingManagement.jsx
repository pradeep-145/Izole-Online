import axios from "axios";
import {
  AlertCircle,
  Calendar,
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  Filter,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

const ShippingManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newPickupDate, setNewPickupDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [processingAction, setProcessingAction] = useState(false);

  // Fetch shipments data from backend
  useEffect(() => {
    fetchShipments();
  }, [filterStatus]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      // Fetch orders with shipment details
      const response = await axios.get("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        params: {
          status: filterStatus !== "all" ? filterStatus : undefined,
        },
      });

      // Process orders to extract shipping information
      const ordersWithShipping = response.data.orders
        .filter((order) => order.shippingInfo) // Only include orders with shipping info
        .map((order) => {
          let shippingDetails;
          try {
            shippingDetails = JSON.parse(order.shippingInfo);
          } catch (e) {
            shippingDetails = {};
          }

          return {
            id: order._id,
            orderNumber: `#${order._id.substring(0, 8)}`,
            customerName: order.customerId?.name || "Guest Customer",
            customerAddress: order.address || "N/A",
            status: order.status,
            paymentStatus: order.paymentStatus,
            createdAt: new Date(order.createdAt),
            pickupDate: order.pickupDate ? new Date(order.pickupDate) : null,
            estimatedDeliveryDate: order.estimatedDeliveryDate
              ? new Date(order.estimatedDeliveryDate)
              : null,
            trackingUrl: order.trackingUrl || null,
            awb: order.awb || "Pending",
            totalAmount: order.totalAmount,
            shippingCharge: order.shippingCharge || shippingDetails.rate || 0,
            products: order.products || [],
            courierName: shippingDetails.courier_name || "Standard Shipping",
            estimatedDays: shippingDetails.estimated_delivery_days || "3-5",
            weight: shippingDetails.weight || "0.5",
            isPriority: order.status === "Processing",
            isDelayed: false, // Could be determined based on expected vs. actual dates
            isRescheduled: order.isRescheduled || false,
          };
        });

      setShipments(ordersWithShipping);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
      setError("Failed to load shipments. Please try again.");
      toast.error("Failed to load shipment data");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting to shipments
  const filteredShipments = shipments
    .filter((shipment) => {
      // If there's a search query, filter by orderNumber, customerName, or awb
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          shipment.orderNumber.toLowerCase().includes(query) ||
          shipment.customerName.toLowerCase().includes(query) ||
          String(shipment.awb).toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Handle sorting based on different fields
      switch (sortBy) {
        case "date":
          return sortOrder === "asc"
            ? a.createdAt - b.createdAt
            : b.createdAt - a.createdAt;
        case "status":
          return sortOrder === "asc"
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        case "priority":
          return sortOrder === "asc"
            ? a.isPriority - b.isPriority
            : b.isPriority - a.isPriority;
        default:
          return 0;
      }
    });

  // Open the reschedule modal for a shipment
  const handleRescheduleClick = (shipment) => {
    setSelectedShipment(shipment);
    setNewPickupDate(shipment.pickupDate || new Date());
    setShowRescheduleModal(true);
  };

  // Submit the reschedule request
  const handleRescheduleSubmit = async () => {
    if (!selectedShipment || !newPickupDate) return;

    setProcessingAction(true);
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = newPickupDate.toISOString().split("T")[0];

      // Make API call to reschedule pickup
      await axios.put(
        `/api/admin/shipments/reschedule/${selectedShipment.id}`,
        {
          pickupDate: formattedDate,
          shipmentId: selectedShipment.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update local state
      setShipments(
        shipments.map((shipment) =>
          shipment.id === selectedShipment.id
            ? {
                ...shipment,
                pickupDate: newPickupDate,
                isRescheduled: true,
              }
            : shipment
        )
      );

      setShowRescheduleModal(false);
      toast.success("Pickup rescheduled successfully");
    } catch (err) {
      console.error("Failed to reschedule pickup:", err);
      toast.error("Failed to reschedule pickup. Please try again.");
    } finally {
      setProcessingAction(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Not scheduled";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if a shipment is eligible for rescheduling
  const canReschedule = (status) => {
    return ["Pending", "Processing"].includes(status);
  };

  // Calculate if shipment is delayed
  const isShipmentDelayed = (shipment) => {
    if (!shipment.estimatedDeliveryDate) return false;
    return shipment.estimatedDeliveryDate < new Date();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterStatus("all");
    setSearchQuery("");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Shipping Management
        </h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchShipments}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order #, customer or AWB..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split("-");
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="status-asc">Status (A-Z)</option>
                <option value="priority-desc">Priority First</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading shipments...</p>
          </div>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-1">
            No shipments found
          </h2>
          <p className="text-gray-600">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "There are no shipments to display"}
          </p>
        </div>
      ) : (
        <>
          {/* Shipments Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipping Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => (
                    <tr
                      key={shipment.id}
                      className={`hover:bg-gray-50 ${
                        shipment.isPriority ? "bg-yellow-50" : ""
                      } ${isShipmentDelayed(shipment) ? "bg-red-50" : ""}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <Package className="h-10 w-10 text-gray-500 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {shipment.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(shipment.createdAt)}
                            </div>
                            {shipment.awb !== "Pending" && (
                              <div className="text-xs text-blue-600 font-medium">
                                AWB: {shipment.awb}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.customerName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-start">
                          <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">
                            {shipment.customerAddress}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            shipment.status
                          )}`}
                        >
                          {shipment.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Payment: {shipment.paymentStatus}
                        </div>

                        {/* Show priority badge if applicable */}
                        {shipment.isPriority && (
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Priority
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm text-gray-800">
                            <Truck className="h-4 w-4 mr-1 text-gray-500" />
                            {shipment.courierName}
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-800">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            Pickup:{" "}
                            <span
                              className={`ml-1 ${
                                shipment.isRescheduled
                                  ? "font-medium text-purple-600"
                                  : ""
                              }`}
                            >
                              {formatDate(shipment.pickupDate)}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-800">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            Delivery Estimate:{" "}
                            <span
                              className={`ml-1 ${
                                isShipmentDelayed(shipment)
                                  ? "text-red-600 font-medium"
                                  : ""
                              }`}
                            >
                              {formatDate(shipment.estimatedDeliveryDate)}
                            </span>
                          </div>
                          {shipment.trackingUrl && (
                            <a
                              href={shipment.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1 underline"
                            >
                              Track Package
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          <button
                            disabled={!canReschedule(shipment.status)}
                            onClick={() => handleRescheduleClick(shipment)}
                            className={`flex items-center justify-center text-xs px-3 py-1.5 rounded-md ${
                              canReschedule(shipment.status)
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Reschedule
                          </button>

                          <button
                            onClick={() => {
                              if (shipment.trackingUrl) {
                                window.open(
                                  shipment.trackingUrl,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              } else {
                                toast.error("No tracking URL available");
                              }
                            }}
                            className={`flex items-center justify-center text-xs px-3 py-1.5 rounded-md ${
                              shipment.trackingUrl
                                ? "bg-amber-600 hover:bg-amber-700 text-white"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Track
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Reschedule Pickup</h3>
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Current pickup date:{" "}
                  <span className="font-medium">
                    {formatDate(selectedShipment.pickupDate)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Order: {selectedShipment.orderNumber}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Pickup Date
                </label>
                <DatePicker
                  selected={newPickupDate}
                  onChange={(date) => setNewPickupDate(date)}
                  minDate={new Date()} // Can't select dates in the past
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Rescheduling may affect delivery estimates
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={processingAction}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  disabled={
                    processingAction ||
                    !newPickupDate ||
                    (selectedShipment.pickupDate &&
                      newPickupDate.getTime() ===
                        selectedShipment.pickupDate.getTime())
                  }
                >
                  {processingAction ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-1" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Reschedule"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingManagement;
