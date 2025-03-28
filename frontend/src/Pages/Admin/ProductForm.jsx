import axios from "axios";
import React, { useState } from "react";
import {
  Package,
  Plus,
  X,
  Save,
  Upload,
  AlertCircle,
  Info,
  Check,
  Edit
} from "lucide-react";

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const [imageVariants, setImageVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    color: "",
    quantity: 0,
    sizes: [],
    images: [],
    price: "",
    originalPrice: "",
  });

  // New state for editing variants
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ 
    show: false, 
    message: "", 
    type: "" 
  });
  const [productAdded, setProductAdded] = useState(false);

  // Available size options
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const getImageLink = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "preset1");
    formData.append("cloud_name", "dxuywp3zi");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxuywp3zi/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload images for each variant
      const processedVariants = await Promise.all(
        imageVariants.map(async (variant) => {
          const uploadedImageLinks = await Promise.all(
            variant.images.map(async (file) => 
              typeof file === 'string' ? file : await getImageLink(file)
            )
          );

          return {
            color: variant.color,
            quantity: variant.quantity,
            image: uploadedImageLinks,
            size: variant.sizes,
            price: variant.price,
            originalPrice: variant.originalPrice,
          };
        })
      );

      const productData = {
        ...formData,
        images: processedVariants,
      };

      const response = await axios.post("/api/products/save", productData);
      
      setNotification({
        show: true,
        message: "Product added successfully!",
        type: "success"
      });
      setProductAdded(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          description: "",
          category: "",
        });
        setImageVariants([]);
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error(error);
      setNotification({
        show: true,
        message: "Error adding product. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = (e) => {
    e.preventDefault();
    
    // Validate current variant
    if (!currentVariant.color || 
        currentVariant.quantity <= 0 || 
        currentVariant.sizes.length === 0 ||
        !currentVariant.price ||
        !currentVariant.originalPrice ||
        currentVariant.images.length === 0) return;

    if (editingVariantIndex !== null) {
      // Update existing variant
      const updatedVariants = [...imageVariants];
      updatedVariants[editingVariantIndex] = { ...currentVariant };
      setImageVariants(updatedVariants);
      setEditingVariantIndex(null);
    } else {
      // Add new variant
      setImageVariants([
        ...imageVariants, 
        { 
          ...currentVariant,
          images: currentVariant.images
        }
      ]);
    }

    // Reset current variant
    setCurrentVariant({
      color: "",
      quantity: 0,
      sizes: [],
      images: [],
      price: "",
      originalPrice: "",
    });
  };

  const handleEditVariant = (index) => {
    const variantToEdit = imageVariants[index];
    setCurrentVariant({ ...variantToEdit });
    setEditingVariantIndex(index);
  };

  const handleToggleSize = (selectedSize) => {
    const currentSizes = currentVariant.sizes;
    setCurrentVariant({
      ...currentVariant,
      sizes: currentSizes.includes(selectedSize)
        ? currentSizes.filter(s => s !== selectedSize)
        : [...currentSizes, selectedSize]
    });
  };

  const handleAddImage = (e) => {
    const filesArray = Array.from(e.target.files);
    setCurrentVariant({
      ...currentVariant,
      images: [...currentVariant.images, ...filesArray]
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...currentVariant.images];
    updatedImages.splice(index, 1);
    setCurrentVariant({
      ...currentVariant,
      images: updatedImages
    });
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = [...imageVariants];
    updatedVariants.splice(index, 1);
    setImageVariants(updatedVariants);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center border-b pb-4 mb-6">
          <Package className="h-6 w-6 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Product Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category*
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 
              ></textarea>
            </div>
          </div>

          {/* Product Variant Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Product Variants</h2>
            
            {/* Variant Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color*
                </label>
                <input
                  type="text"
                  id="color"
                  value={currentVariant.color}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Black, Red, Blue"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity*
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={currentVariant.quantity}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, quantity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    value={currentVariant.price}
                    onChange={(e) => setCurrentVariant({ ...currentVariant, price: parseFloat(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                     
                  />
                </div>
              </div>
            </div>

            {/* Additional Variant Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    id="originalPrice"
                    value={currentVariant.originalPrice}
                    onChange={(e) => setCurrentVariant({ ...currentVariant, originalPrice: parseFloat(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                     
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Sizes*
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sizeOption) => (
                    <button
                      key={sizeOption}
                      type="button"
                      onClick={() => handleToggleSize(sizeOption)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentVariant.sizes.includes(sizeOption)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images*
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="variant-images"
                    className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Images
                  </label>
                  <input
                    id="variant-images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddImage}
                  />
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {currentVariant.images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentVariant.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="relative w-20 h-20">
                    <img
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                      alt={`Variant image ${imgIndex}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(imgIndex)}
                      className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Update Variant Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                disabled={
                  !currentVariant.color || 
                  currentVariant.quantity <= 0 || 
                  currentVariant.sizes.length === 0 ||
                  !currentVariant.price ||
                  !currentVariant.originalPrice ||
                  currentVariant.images.length === 0
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                {editingVariantIndex !== null ? 'Update Variant' : 'Add Variant'}
              </button>
            </div>

            {/* Added Variants List */}
            {imageVariants.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Added Variants</h3>
                {imageVariants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-700">
                          {variant.color} - ${variant.price}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {variant.sizes.map((size) => (
                            <span 
                              key={size} 
                              className="px-2 py-0.5 bg-gray-100 rounded-sm text-xs"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Quantity: {variant.quantity} | Images: {variant.images.length}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditVariant(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || productAdded || imageVariants.length === 0}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white ${
                (loading || productAdded || imageVariants.length === 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span>Saving...</span>
              ) : productAdded ? (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-2" /> Product Added
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-4 w-4 mr-2" /> Save Product
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;