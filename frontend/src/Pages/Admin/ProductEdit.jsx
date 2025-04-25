import axios from "axios";
import { ChevronLeft, Plus, Save, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../zustand/useProducts.jsx";

const ProductEdit = () => {
  const { productId, variantIndex } = useParams();
  const { products, fetchProductsIfEmpty } = useProduct();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    color: "",
    images: [],
    sizeOptions: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadProductData = async () => {
      await fetchProductsIfEmpty();

      const product = products.find((p) => p._id === productId);
      if (
        product &&
        product.variants &&
        product.variants[Number(variantIndex)]
      ) {
        const variant = product.variants[Number(variantIndex)];

        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          color: variant.color,
          images: [...variant.images],
          sizeOptions: variant.sizeOptions.map((option) => ({
            size: option.size,
            quantity: option.quantity,
            price: option.price,
            originalPrice: option.originalPrice,
          })),
        });

        setLoading(false);
      }
    };

    loadProductData();
  }, [productId, variantIndex, products, fetchProductsIfEmpty]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle size option changes
  const handleSizeOptionChange = (index, field, value) => {
    const updatedSizeOptions = [...formData.sizeOptions];
    updatedSizeOptions[index] = {
      ...updatedSizeOptions[index],
      [field]:
        field === "quantity" || field === "price" || field === "originalPrice"
          ? Number(value)
          : value,
    };

    setFormData((prev) => ({
      ...prev,
      sizeOptions: updatedSizeOptions,
    }));
  };

  // Add new size option
  const addSizeOption = () => {
    setFormData((prev) => ({
      ...prev,
      sizeOptions: [
        ...prev.sizeOptions,
        { size: "", quantity: 0, price: 0, originalPrice: 0 },
      ],
    }));
  };

  // Remove size option
  const removeSizeOption = (index) => {
    const updatedSizeOptions = formData.sizeOptions.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      sizeOptions: updatedSizeOptions,
    }));
  };

  // Remove image
  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Find the original product to update
      const originalProduct = products.find((p) => p._id === productId);
      if (!originalProduct) throw new Error("Product not found");

      // Create updated product with the edited variant
      const updatedProduct = { ...originalProduct };
      updatedProduct.name = formData.name;
      updatedProduct.description = formData.description;
      updatedProduct.category = formData.category;

      // Update the specific variant
      const updatedVariants = [...updatedProduct.variants];
      updatedVariants[Number(variantIndex)] = {
        color: formData.color,
        images: formData.images,
        sizeOptions: formData.sizeOptions,
        details: updatedVariants[Number(variantIndex)].details || [],
      };

      updatedProduct.variants = updatedVariants;

      // Make API call to update the product
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
        updatedProduct
      );

      toast.success("Product updated successfully!");
      navigate(`/admin/products/view/${productId}/${variantIndex}`);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading product data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() =>
              navigate(`/admin/products/view/${productId}/${variantIndex}`)
            }
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center ${
            saving ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h2>

              {/* Product Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Product Category */}
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Variant Color */}
              <div className="mb-4">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Product Description */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Images
                </h2>
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={image}
                        alt={`Product ${idx + 1}`}
                        className="w-24 h-24 rounded-md object-cover border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {/* Image upload would typically go here with file input */}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Size Options
                </h2>

                {formData.sizeOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-3 border border-gray-200 rounded-md relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeSizeOption(idx)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size
                        </label>
                        <input
                          type="text"
                          value={option.size}
                          onChange={(e) =>
                            handleSizeOptionChange(idx, "size", e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={option.quantity}
                          onChange={(e) =>
                            handleSizeOptionChange(
                              idx,
                              "quantity",
                              e.target.value
                            )
                          }
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={option.price}
                          onChange={(e) =>
                            handleSizeOptionChange(idx, "price", e.target.value)
                          }
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price (₹)
                        </label>
                        <input
                          type="number"
                          value={option.originalPrice}
                          onChange={(e) =>
                            handleSizeOptionChange(
                              idx,
                              "originalPrice",
                              e.target.value
                            )
                          }
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSizeOption}
                  className="px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 flex items-center justify-center w-full hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Size Option
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
