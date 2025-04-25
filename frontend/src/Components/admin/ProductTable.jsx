import axios from "axios";
import { ChevronDown, ChevronUp, Edit, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../zustand/useProducts.jsx";

const ProductTable = () => {
  const { products, fetchProductsIfEmpty, deleteProduct } = useProduct();
  const [expandedProducts, setExpandedProducts] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    productId: null,
    variantIndex: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductsIfEmpty();
  }, [fetchProductsIfEmpty]);

  const toggleExpand = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Helper function to handle color display
  const getColorDisplay = (color) => {
    const colorName = color.toLowerCase();
    const actualColor = colorName.split(" ").pop();
    return { name: color, displayColor: actualColor };
  };

  // Truncate long descriptions
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Calculate total stock for a variant based on its sizeOptions
  const calculateVariantStock = (variant) => {
    if (!variant || !variant.sizeOptions) return 0;
    return variant.sizeOptions.reduce(
      (sum, sizeOption) => sum + (sizeOption.quantity || 0),
      0
    );
  };

  // Calculate total stock for a product
  const calculateTotalStock = (product) => {
    if (!product || !product.variants) return 0;
    return product.variants.reduce(
      (sum, variant) => sum + calculateVariantStock(variant),
      0
    );
  };

  // Get minimum price for a variant
  const getMinPrice = (variant) => {
    if (!variant || !variant.sizeOptions || variant.sizeOptions.length === 0)
      return 0;
    return Math.min(...variant.sizeOptions.map((option) => option.price));
  };

  // Get original price for comparison
  const getOriginalPrice = (variant) => {
    if (!variant || !variant.sizeOptions || variant.sizeOptions.length === 0)
      return 0;
    const minPrice = getMinPrice(variant);
    const correspondingOption = variant.sizeOptions.find(
      (option) => option.price === minPrice
    );
    return correspondingOption ? correspondingOption.originalPrice : minPrice;
  };

  // View product variant in detail
  const handleViewVariant = (productId, variantIndex) => {
    navigate(`/admin/products/view/${productId}/${variantIndex}`);
  };

  // Navigate to edit page for a product variant
  const handleEditVariant = (productId, variantIndex) => {
    navigate(`/admin/products/edit/${productId}/${variantIndex}`);
  };

  // Show delete confirmation dialog
  const showDeleteConfirmation = (productId, variantIndex) => {
    setDeleteConfirmation({
      show: true,
      productId,
      variantIndex,
    });
  };

  // Delete a product variant
  const confirmDelete = async () => {
    const { productId, variantIndex } = deleteConfirmation;

    try {
      // Find the product from our products list
      const product = products.find((p) => p._id === productId);

      // If it's the only variant, delete entire product
      if (product.variants.length === 1) {
        await deleteProduct(productId);
        toast.success("Product deleted successfully");
      } else {
        // Otherwise just delete the variant
        const updatedProduct = { ...product };
        updatedProduct.variants = updatedProduct.variants.filter(
          (_, idx) => idx !== variantIndex
        );

        // API call to update product with removed variant
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
          updatedProduct
        );

        // Update local state
        await fetchProductsIfEmpty(true); // Force refresh
        toast.success("Variant deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product/variant:", error);
      toast.error("Failed to delete. Please try again.");
    } finally {
      // Close confirmation dialog
      setDeleteConfirmation({
        show: false,
        productId: null,
        variantIndex: null,
      });
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, productId: null, variantIndex: null });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Color Variant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Images
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Sizes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y text-black divide-gray-200">
          {products &&
            products.map((product) => (
              <React.Fragment key={product._id}>
                {/* Main Product Row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap" colSpan="8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleExpand(product._id)}
                          className="mr-2 text-gray-500 hover:text-gray-700"
                        >
                          {expandedProducts[product._id] ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            {product.category && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                {product.category}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {product._id.slice(-5)}
                          </div>
                          {product.description && (
                            <div className="text-xs text-gray-600 mt-1 max-w-md">
                              {truncateDescription(product.description)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.variants ? product.variants.length : 0}{" "}
                        variants | Total Stock: {calculateTotalStock(product)}
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Variant Rows */}
                {expandedProducts[product._id] &&
                  product.variants &&
                  product.variants.map((variant, index) => {
                    const { name: colorName, displayColor } = getColorDisplay(
                      variant.color
                    );
                    const variantStock = calculateVariantStock(variant);
                    const minPrice = getMinPrice(variant);
                    const originalPrice = getOriginalPrice(variant);

                    return (
                      <tr
                        key={`${product._id}-variant-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="pl-8 text-sm text-gray-500">
                            Variant {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div
                              className="w-6 h-6 rounded-full border mr-2"
                              style={{ backgroundColor: displayColor }}
                              title={colorName}
                            ></div>
                            <span className="text-sm font-medium">
                              {colorName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {variant.images &&
                              variant.images
                                .map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`${product.name} ${variant.color} ${
                                      idx + 1
                                    }`}
                                    className="h-10 w-10 rounded-md object-cover border border-gray-200"
                                  />
                                ))
                                .slice(0, 3)}
                            {variant.images && variant.images.length > 3 && (
                              <span className="text-xs text-gray-500 flex items-center">
                                +{variant.images.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {variant.sizeOptions &&
                              variant.sizeOptions.map((sizeOption, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-md"
                                  title={`${sizeOption.size}: ${sizeOption.quantity} in stock`}
                                >
                                  {sizeOption.size}
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium">₹{minPrice}</div>
                            {originalPrice > minPrice && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹{originalPrice}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">{variantStock} units</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          variantStock > 20
                            ? "bg-green-100 text-green-800"
                            : variantStock > 5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                          >
                            {variantStock > 20
                              ? "In Stock"
                              : variantStock > 5
                              ? "Low Stock"
                              : "Critical Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleViewVariant(product._id, index)
                              }
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleEditVariant(product._id, index)
                              }
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                              title="Edit Variant"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                showDeleteConfirmation(product._id, index)
                              }
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                              title="Delete Variant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-500 mb-5">
              Are you sure you want to delete this variant? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
