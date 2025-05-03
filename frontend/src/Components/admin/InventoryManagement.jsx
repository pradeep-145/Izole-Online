import axios from "axios";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  Edit,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Upload,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch inventory
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/inventory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setInventory(response.data.inventory);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(response.data.inventory.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);

      // Reset to first page when fetching new data
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update inventory item quantity
  const updateInventoryItem = async (
    productId,
    variantIndex,
    sizeIndex,
    quantity
  ) => {
    try {
      await axios.put(
        "/api/admin/inventory/update",
        { productId, variantIndex, sizeIndex, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update local state
      setInventory((prevInventory) =>
        prevInventory.map((product) => {
          if (product._id === productId) {
            const updatedVariants = [...product.variants];
            updatedVariants[variantIndex] = {
              ...updatedVariants[variantIndex],
              sizeOptions: updatedVariants[variantIndex].sizeOptions.map(
                (so, idx) => (idx === sizeIndex ? { ...so, quantity } : so)
              ),
            };
            return { ...product, variants: updatedVariants };
          }
          return product;
        })
      );

      // Clear editing state
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Filter inventory
  const filteredInventory = inventory.filter((product) => {
    // Category filter
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    // Stock filter
    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = product.variants.some((variant) =>
        variant.sizeOptions.some(
          (size) => size.quantity > 0 && size.quantity < 10
        )
      );
    } else if (stockFilter === "out") {
      matchesStock = product.variants.some((variant) =>
        variant.sizeOptions.some((size) => size.quantity === 0)
      );
    }

    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variants.some((variant) =>
        variant.color.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCategory && matchesStock && matchesSearch;
  });

  // Calculate total items for pagination
  const totalItems = filteredInventory.reduce(
    (count, product) =>
      count +
      product.variants.reduce(
        (variantCount, variant) => variantCount + variant.sizeOptions.length,
        0
      ),
    0
  );

  // Get paginated items
  const getPaginatedItems = () => {
    // First, flatten the data structure to have one row per size option
    const flattenedItems = [];

    filteredInventory.forEach((product, productIndex) => {
      product.variants.forEach((variant, variantIndex) => {
        variant.sizeOptions.forEach((sizeOption, sizeIndex) => {
          flattenedItems.push({
            product,
            variant,
            sizeOption,
            productIndex,
            variantIndex,
            sizeIndex,
          });
        });
      });
    });

    // Calculate start and end indices for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Return the items for the current page
    return flattenedItems.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get stock status
  const getStockStatus = (sizeOptions) => {
    const totalQuantity = sizeOptions.reduce(
      (sum, size) => sum + size.quantity,
      0
    );

    if (totalQuantity === 0) {
      return {
        status: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: <XCircle className="w-4 h-4 mr-1" />,
      };
    } else if (totalQuantity < 10) {
      return {
        status: "Low Stock",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        icon: <AlertTriangle className="w-4 h-4 mr-1" />,
      };
    } else {
      return {
        status: "In Stock",
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
      };
    }
  };

  // Get paginated data
  const paginatedItems = getPaginatedItems();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Inventory Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track product inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {showBulkActions && (
        <div className="p-4 bg-blue-50 border-b border-blue-100 flex flex-wrap gap-2 items-center animate-fadeIn">
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-1" /> Import
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 mr-1" /> Sync
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-40">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-40">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <button
            onClick={fetchInventory}
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
            title="Refresh inventory"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-500">Loading inventory...</p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.map((item, index) => {
                const {
                  product,
                  variant,
                  sizeOption,
                  variantIndex,
                  sizeIndex,
                } = item;
                const stockStatus = getStockStatus([sizeOption]);
                const isEditing =
                  editingItem &&
                  editingItem.productId === product._id &&
                  editingItem.variantIndex === variantIndex &&
                  editingItem.sizeIndex === sizeIndex;

                return (
                  <tr
                    key={`${product._id}-${variantIndex}-${sizeIndex}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {variant.images && variant.images[0] ? (
                          <img
                            src={variant.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-200 mr-3"></div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            SKU: {product._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{
                            backgroundColor: variant.color.toLowerCase(),
                          }}
                        ></div>
                        {variant.color}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {sizeOption.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editingItem.quantity}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              quantity: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {sizeOption.quantity}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{sizeOption.price}
                        </div>
                        {sizeOption.originalPrice > sizeOption.price && (
                          <div className="text-xs text-gray-500 line-through">
                            ₹{sizeOption.originalPrice}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}
                      >
                        {stockStatus.icon}
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              updateInventoryItem(
                                product._id,
                                variantIndex,
                                sizeIndex,
                                editingItem.quantity
                              )
                            }
                            className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setEditingItem({
                              productId: product._id,
                              variantIndex: variantIndex,
                              sizeIndex: sizeIndex,
                              quantity: sizeOption.quantity,
                            })
                          }
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit quantity"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredInventory.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default InventoryManagement;
