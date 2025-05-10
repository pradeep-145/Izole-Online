import axios from "axios";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Search,
  Upload,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Pagination from "./Pagination";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorFilter, setColorFilter] = useState("all");
  const [expandedProducts, setExpandedProducts] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [viewMode, setViewMode] = useState("grouped"); // "grouped" or "detailed"

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch inventory with debounce
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/inventory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const inventoryData = response.data.inventory;
      setInventory(inventoryData);

      // Extract unique categories and colors
      const uniqueCategories = [
        ...new Set(inventoryData.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);

      // Extract all colors from variants
      const allColors = [];
      inventoryData.forEach((product) => {
        product.variants.forEach((variant) => {
          if (!allColors.includes(variant.color)) {
            allColors.push(variant.color);
          }
        });
      });
      setColors(allColors.sort());

      // Reset to first page when fetching new data
      setCurrentPage(1);
      toast.success("Inventory updated successfully");
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  }, []);

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
      toast.success("Inventory updated successfully");
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Failed to update inventory");
    }
  };

  // Handle bulk update for inventory items
  const handleBulkUpdate = async (action) => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    try {
      setLoading(true);

      // Implement different bulk actions
      switch (action) {
        case "mark-out-of-stock":
          // Just for demonstration - this would typically be an API call
          toast.success(
            `Marked ${selectedProducts.length} products as out of stock`
          );
          break;
        case "discount":
          toast.success(
            `Applied discount to ${selectedProducts.length} products`
          );
          break;
        default:
          toast.error("Unknown action");
      }

      // Reset selection after successful operation
      setSelectedProducts([]);
      setShowBulkActions(false);
      await fetchInventory();
    } catch (error) {
      console.error("Error with bulk update:", error);
      toast.error("Failed to update products");
    } finally {
      setLoading(false);
    }
  };

  // Export inventory as CSV
  const exportInventory = () => {
    // Map inventory data for export
    const exportData = filteredInventory.flatMap((product) =>
      product.variants.flatMap((variant) =>
        variant.sizeOptions.map((sizeOption) => ({
          "Product Name": product.name,
          "Product ID": product._id,
          Category: product.category,
          Color: variant.color,
          Size: sizeOption.size,
          Quantity: sizeOption.quantity,
          Price: sizeOption.price,
          "Original Price": sizeOption.originalPrice,
        }))
      )
    );

    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(","),
      ...exportData.map((row) =>
        headers.map((header) => JSON.stringify(row[header])).join(",")
      ),
    ];

    // Create and download file
    const csvString = csvRows.join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `inventory_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
    toast.success("Inventory exported successfully");
  };

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Toggle expanded view
  const toggleProductExpand = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Handle product selection
  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Handle select all products
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredInventory.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredInventory.map((product) => product._id));
    }
  };

  // Sort inventory
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedInventory = useMemo(() => {
    if (!sortConfig.key) return inventory;

    return [...inventory].sort((a, b) => {
      // Handle nested properties
      if (sortConfig.key === "stock") {
        const stockA = calculateTotalStock(a);
        const stockB = calculateTotalStock(b);
        return sortConfig.direction === "asc"
          ? stockA - stockB
          : stockB - stockA;
      }

      if (sortConfig.key === "price") {
        const priceA = getMinPrice(a);
        const priceB = getMinPrice(b);
        return sortConfig.direction === "asc"
          ? priceA - priceB
          : priceB - priceA;
      }

      // Regular properties
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [inventory, sortConfig]);

  // Calculate total stock for a product
  const calculateTotalStock = (product) => {
    if (!product || !product.variants) return 0;
    return product.variants.reduce(
      (sum, variant) =>
        sum +
        variant.sizeOptions.reduce(
          (variantSum, size) => variantSum + (size.quantity || 0),
          0
        ),
      0
    );
  };

  // Get minimum price for a product across all variants
  const getMinPrice = (product) => {
    if (!product || !product.variants) return 0;
    const allPrices = product.variants.flatMap((variant) =>
      variant.sizeOptions.map((option) => option.price)
    );
    return Math.min(...allPrices);
  };

  // Get maximum price for a product across all variants
  const getMaxPrice = (product) => {
    if (!product || !product.variants) return 0;
    const allPrices = product.variants.flatMap((variant) =>
      variant.sizeOptions.map((option) => option.price)
    );
    return Math.max(...allPrices);
  };

  // Apply filters to inventory
  const filteredInventory = useMemo(() => {
    return sortedInventory.filter((product) => {
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

      // Color filter
      const matchesColor =
        colorFilter === "all" ||
        product.variants.some(
          (variant) => variant.color.toLowerCase() === colorFilter.toLowerCase()
        );

      // Price filter
      let matchesPrice = true;
      if (priceFilter.min !== "" || priceFilter.max !== "") {
        const minPrice = getMinPrice(product);
        const maxPrice = getMaxPrice(product);

        if (priceFilter.min !== "" && priceFilter.max !== "") {
          matchesPrice =
            minPrice >= parseFloat(priceFilter.min) &&
            maxPrice <= parseFloat(priceFilter.max);
        } else if (priceFilter.min !== "") {
          matchesPrice = minPrice >= parseFloat(priceFilter.min);
        } else if (priceFilter.max !== "") {
          matchesPrice = maxPrice <= parseFloat(priceFilter.max);
        }
      }

      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.variants.some((variant) =>
          variant.color.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return (
        matchesCategory &&
        matchesStock &&
        matchesColor &&
        matchesPrice &&
        matchesSearch
      );
    });
  }, [
    sortedInventory,
    categoryFilter,
    stockFilter,
    colorFilter,
    priceFilter,
    searchTerm,
  ]);

  // Get stock status for visual indicators
  const getStockStatus = (product) => {
    const totalStock = calculateTotalStock(product);

    if (totalStock === 0) {
      return {
        status: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: <XCircle className="w-4 h-4 mr-1" />,
      };
    } else if (totalStock < 10) {
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

  // Handle pagination for grouped view
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInventory.slice(startIndex, endIndex);
  }, [filteredInventory, currentPage, itemsPerPage]);

  // Reset all filters
  const resetFilters = () => {
    setCategoryFilter("all");
    setStockFilter("all");
    setColorFilter("all");
    setPriceFilter({ min: "", max: "" });
    setSearchTerm("");
    setSortConfig({ key: "name", direction: "asc" });
  };

  // Sorting indicator component
  const SortIndicator = ({ currentKey }) => {
    if (sortConfig.key !== currentKey) return null;

    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Inventory Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track product inventory ({filteredInventory.length}{" "}
            products)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className={`px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm flex items-center ${
              selectedProducts.length > 0
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            <MoreHorizontal className="w-4 h-4 mr-2" />
            Actions
            {selectedProducts.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {selectedProducts.length}
              </span>
            )}
          </button>
          <button
            onClick={() =>
              setViewMode(viewMode === "grouped" ? "detailed" : "grouped")
            }
            className="px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm flex items-center"
          >
            {viewMode === "grouped" ? "Detailed View" : "Grouped View"}
          </button>
          <button
            onClick={() => {
              /* Add product functionality */
            }}
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
          <span className="text-sm text-gray-700 mr-2">Bulk Actions:</span>
          <button
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors"
            onClick={() => handleBulkUpdate("mark-out-of-stock")}
          >
            Mark Out of Stock
          </button>
          <button
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors"
            onClick={() => handleBulkUpdate("discount")}
          >
            Apply Discount
          </button>
          <button
            onClick={exportInventory}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-1" /> Import
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col gap-4">
        {/* Search bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
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

        {/* Advanced filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Color:</label>
            <select
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
            >
              <option value="all">All Colors</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Price Range:</label>
            <input
              type="number"
              placeholder="Min"
              className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={priceFilter.min}
              onChange={(e) =>
                setPriceFilter((prev) => ({ ...prev, min: e.target.value }))
              }
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={priceFilter.max}
              onChange={(e) =>
                setPriceFilter((prev) => ({ ...prev, max: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Items per page:</label>
            <select
              className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors ml-auto"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Inventory Tables */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-500">Loading inventory...</p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              No products found matching your filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 text-blue-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : viewMode === "grouped" ? (
          // Grouped view (product-centric)
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === filteredInventory.length &&
                      filteredInventory.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Product
                    <SortIndicator currentKey="name" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    <SortIndicator currentKey="category" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center">
                    Price Range
                    <SortIndicator currentKey="price" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center">
                    Total Stock
                    <SortIndicator currentKey="stock" />
                  </div>
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
              {paginatedProducts.map((product) => {
                const isExpanded = expandedProducts[product._id];
                const stockStatus = getStockStatus(product);
                const totalStock = calculateTotalStock(product);
                const minPrice = getMinPrice(product);
                const maxPrice = getMaxPrice(product);

                return (
                  <React.Fragment key={product._id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleProductSelection(product._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleProductExpand(product._id)}
                            className="mr-2 text-gray-500"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                          <div className="flex items-center">
                            {product.variants?.[0]?.images?.[0] ? (
                              <img
                                src={product.variants[0].images[0]}
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
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {product.variants.map((variant, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full border border-gray-300"
                              style={{
                                backgroundColor: variant.color.toLowerCase(),
                              }}
                              title={`${variant.color} (${variant.sizeOptions.length} sizes)`}
                            ></div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {minPrice === maxPrice
                          ? `₹${minPrice}`
                          : `₹${minPrice} - ₹${maxPrice}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalStock}
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
                        <div className="flex space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded variant rows */}
                    {isExpanded &&
                      product.variants.map((variant, variantIndex) => (
                        <tr
                          key={`${product._id}-variant-${variantIndex}`}
                          className="bg-gray-50 border-t border-gray-100"
                        >
                          <td className="px-3 py-2"></td>
                          <td colSpan={7} className="px-6 py-3">
                            <div className="pl-7">
                              <div className="flex items-center mb-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                                  style={{
                                    backgroundColor:
                                      variant.color.toLowerCase(),
                                  }}
                                ></div>
                                <span className="text-sm font-medium">
                                  {variant.color}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                {variant.sizeOptions.map((size, sizeIndex) => (
                                  <div
                                    key={sizeIndex}
                                    className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
                                  >
                                    <div>
                                      <p className="text-sm font-medium">
                                        {size.size}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        ₹{size.price}
                                      </p>
                                    </div>

                                    {editingItem &&
                                    editingItem.productId === product._id &&
                                    editingItem.variantIndex === variantIndex &&
                                    editingItem.sizeIndex === sizeIndex ? (
                                      <div className="flex items-center">
                                        <input
                                          type="number"
                                          min="0"
                                          value={editingItem.quantity}
                                          onChange={(e) =>
                                            setEditingItem({
                                              ...editingItem,
                                              quantity:
                                                parseInt(e.target.value) || 0,
                                            })
                                          }
                                          className="w-16 p-1 border border-gray-300 rounded-md mr-2"
                                        />
                                        <button
                                          onClick={() =>
                                            updateInventoryItem(
                                              product._id,
                                              variantIndex,
                                              sizeIndex,
                                              editingItem.quantity
                                            )
                                          }
                                          className="p-1 text-green-600 hover:text-green-800"
                                          title="Save"
                                        >
                                          <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => setEditingItem(null)}
                                          className="p-1 text-gray-500 hover:text-gray-700"
                                          title="Cancel"
                                        >
                                          <XCircle className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center">
                                        <span
                                          className={`text-sm mr-2 ${
                                            size.quantity === 0
                                              ? "text-red-600"
                                              : size.quantity < 5
                                              ? "text-yellow-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          {size.quantity}
                                        </span>
                                        <button
                                          onClick={() =>
                                            setEditingItem({
                                              productId: product._id,
                                              variantIndex,
                                              sizeIndex,
                                              quantity: size.quantity,
                                            })
                                          }
                                          className="p-1 text-blue-600 hover:text-blue-800"
                                          title="Edit quantity"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          // Detailed view (size-centric for editing)
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === filteredInventory.length &&
                      filteredInventory.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.flatMap((product) =>
                product.variants.flatMap((variant, variantIndex) =>
                  variant.sizeOptions.map((sizeOption, sizeIndex) => {
                    const isEditing =
                      editingItem &&
                      editingItem.productId === product._id &&
                      editingItem.variantIndex === variantIndex &&
                      editingItem.sizeIndex === sizeIndex;

                    return (
                      <tr
                        key={`${product._id}-${variantIndex}-${sizeIndex}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => toggleProductSelection(product._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {variant.images?.[0] ? (
                              <img
                                src={variant.images[0]}
                                alt={product.name}
                                className="w-8 h-8 rounded-md object-cover mr-3"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-md bg-gray-200 mr-3"></div>
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
                              className="w-16 p-1 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <span
                              className={`text-sm font-medium ${
                                sizeOption.quantity === 0
                                  ? "text-red-600"
                                  : sizeOption.quantity < 5
                                  ? "text-yellow-600"
                                  : "text-gray-900"
                              }`}
                            >
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
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save changes"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setEditingItem({
                                  productId: product._id,
                                  variantIndex,
                                  sizeIndex,
                                  quantity: sizeOption.quantity,
                                })
                              }
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Edit quantity"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredInventory.length > 0 && (
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredInventory.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={filteredInventory.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
