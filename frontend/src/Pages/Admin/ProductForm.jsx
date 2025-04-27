import axios from "axios";
import { Plus, Save, Trash2, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdmin } from "../../zustand/useAdmin";

const ProductForm = ({ productId = null, onSuccess, onCancel }) => {
  const { getProductById, createProduct, updateProduct, isLoading } =
    useAdmin();
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    variants: [
      {
        color: "",
        images: [],
        sizeOptions: [{ size: "", quantity: 0, price: 0, originalPrice: 0 }],
      },
    ],
  });

  // Load existing product data if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const response = await getProductById(productId);
        if (response.product) {
          setFormData(response.product);
        }
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, getProductById]);

  // Handle basic field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle variant changes
  const handleVariantChange = (variantIndex, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      [field]: value,
    };

    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Handle size option changes
  const handleSizeOptionChange = (variantIndex, sizeIndex, field, value) => {
    const updatedVariants = [...formData.variants];
    const updatedSizeOptions = [...updatedVariants[variantIndex].sizeOptions];

    updatedSizeOptions[sizeIndex] = {
      ...updatedSizeOptions[sizeIndex],
      [field]: field === "size" ? value : Number(value),
    };

    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      sizeOptions: updatedSizeOptions,
    };

    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Add a new variant
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          images: [],
          sizeOptions: [{ size: "", quantity: 0, price: 0, originalPrice: 0 }],
        },
      ],
    }));
  };

  // Remove a variant
  const removeVariant = (index) => {
    if (formData.variants.length === 1) {
      toast.error("Product must have at least one variant");
      return;
    }

    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Add a size option to a variant
  const addSizeOption = (variantIndex) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].sizeOptions.push({
      size: "",
      quantity: 0,
      price: 0,
      originalPrice: 0,
    });

    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Remove a size option from a variant
  const removeSizeOption = (variantIndex, sizeIndex) => {
    if (formData.variants[variantIndex].sizeOptions.length === 1) {
      toast.error("Variant must have at least one size option");
      return;
    }

    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].sizeOptions = updatedVariants[
      variantIndex
    ].sizeOptions.filter((_, i) => i !== sizeIndex);

    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Handle image upload
  const handleImageUpload = async (variantIndex, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "izole_uploads");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/your-cloud-name/image/upload",
          formData
        );

        return response.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const updatedVariants = [...formData.variants];
      updatedVariants[variantIndex].images = [
        ...updatedVariants[variantIndex].images,
        ...uploadedUrls,
      ];

      setFormData((prev) => ({ ...prev, variants: updatedVariants }));
      toast.success(`${uploadedUrls.length} images uploaded`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove an image
  const removeImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].images = updatedVariants[
      variantIndex
    ].images.filter((_, i) => i !== imageIndex);

    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    // Validate each variant has a color and at least one image
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];

      if (!variant.color.trim()) {
        toast.error(`Color is required for variant ${i + 1}`);
        return;
      }

      if (variant.images.length === 0) {
        toast.error(`At least one image is required for variant ${i + 1}`);
        return;
      }

      // Validate size options
      for (let j = 0; j < variant.sizeOptions.length; j++) {
        const sizeOption = variant.sizeOptions[j];

        if (!sizeOption.size.trim()) {
          toast.error(
            `Size is required for option ${j + 1} of variant ${i + 1}`
          );
          return;
        }

        if (sizeOption.price <= 0) {
          toast.error(
            `Price must be greater than 0 for option ${j + 1} of variant ${
              i + 1
            }`
          );
          return;
        }
      }
    }

    try {
      let result;

      if (productId) {
        result = await updateProduct(productId, formData);
      } else {
        result = await createProduct(formData);
      }

      if (result.success) {
        toast.success(
          `Product ${productId ? "updated" : "created"} successfully`
        );
        if (onSuccess) onSuccess(result.product);
      } else {
        toast.error(
          result.message ||
            `Failed to ${productId ? "update" : "create"} product`
        );
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(`Failed to ${productId ? "update" : "create"} product`);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Product Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Basic Product Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Variants Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Variants</h2>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Variant
              </button>
            </div>

            {/* Variants */}
            {formData.variants.map((variant, variantIndex) => (
              <div
                key={variantIndex}
                className="mb-8 p-4 border border-gray-200 rounded-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    Variant {variantIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeVariant(variantIndex)}
                    className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Color */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(variantIndex, "color", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Images */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                    {variant.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="relative">
                        <img
                          src={image}
                          alt={`Variant ${variantIndex + 1} preview ${
                            imageIndex + 1
                          }`}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(variantIndex, imageIndex)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">
                          Upload
                        </span>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleImageUpload(variantIndex, e)}
                          className="hidden"
                          accept="image/*"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                  {isUploading && (
                    <p className="text-sm text-blue-500">Uploading images...</p>
                  )}
                </div>

                {/* Size Options */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Size Options
                    </label>
                    <button
                      type="button"
                      onClick={() => addSizeOption(variantIndex)}
                      className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Size
                    </button>
                  </div>

                  <div className="space-y-2">
                    {variant.sizeOptions.map((sizeOption, sizeIndex) => (
                      <div
                        key={sizeIndex}
                        className="grid grid-cols-5 gap-2 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Size"
                          value={sizeOption.size}
                          onChange={(e) =>
                            handleSizeOptionChange(
                              variantIndex,
                              sizeIndex,
                              "size",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={sizeOption.quantity}
                          onChange={(e) =>
                            handleSizeOptionChange(
                              variantIndex,
                              sizeIndex,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={sizeOption.price}
                          onChange={(e) =>
                            handleSizeOptionChange(
                              variantIndex,
                              sizeIndex,
                              "price",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Original Price"
                          value={sizeOption.originalPrice}
                          onChange={(e) =>
                            handleSizeOptionChange(
                              variantIndex,
                              sizeIndex,
                              "originalPrice",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeSizeOption(variantIndex, sizeIndex)
                          }
                          className="inline-flex items-center justify-center text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || isUploading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading || isUploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
