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
  Check
} from "lucide-react";

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    details: [],
    rating: 0,
    reviewCount: 0,
  });

  const [newDetail, setNewDetail] = useState("");
  const [images, setImages] = useState([]);
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
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
      const uploadedImages = await Promise.all(
        images.map(async (imageData) => {
          const uploadedImageLinks = await Promise.all(
            imageData.image.map(async (file) => await getImageLink(file))
          );

          return {
            color: imageData.color,
            quantity: imageData.quantity,
            image: uploadedImageLinks,
            size: imageData.size || [],
          };
        })
      );

      const productData = {
        ...formData,
        images: uploadedImages,
        // Add any other fields you want to include
      };

      const response = await axios.post("/api/products/save", productData);
      console.log(response);
      setNotification({
        show: true,
        message: "Product added successfully!",
        type: "success"
      });
      setProductAdded(true);
      
      // Clear form after success
      setTimeout(() => {
        setFormData({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          details: [],
          rating: 0,
          reviewCount: 0,
        });
        setImages([]);
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.log(error);
      setNotification({
        show: true,
        message: "Error adding product. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDetail = (e) => {
    e.preventDefault();
    if (newDetail.trim() !== "") {
      setFormData({
        ...formData,
        details: [...formData.details, newDetail.trim()]
      });
      setNewDetail("");
    }
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData({
      ...formData,
      details: updatedDetails
    });
  };

  const handleToggleSize = (selectedSize) => {
    if (sizes.includes(selectedSize)) {
      setSizes(sizes.filter(s => s !== selectedSize));
    } else {
      setSizes([...sizes, selectedSize]);
    }
  };

  const handleAddColor = (e) => {
    e.preventDefault();
    if (!color || quantity <= 0 || sizes.length === 0) return;

    setImages([...images, { color, quantity, image: [], size: sizes }]);
    setColor("");
    setQuantity(0);
    setSizes([]);
  };

  const handleRemoveColor = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleAddImage = (e, index) => {
    const filesArray = Array.from(e.target.files);
    setImages(
      images.map((img, i) =>
        i === index ? { ...img, image: [...img.image, ...filesArray] } : img
      )
    );
  };

  const handleRemoveImage = (colorIndex, imageIndex) => {
    const updatedImages = [...images];
    updatedImages[colorIndex].image.splice(imageIndex, 1);
    setImages(updatedImages);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center border-b pb-4 mb-6">
          <Package className="h-6 w-6 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        </div>

        {notification.show && (
          <div className={`mb-6 p-4 rounded-md ${notification.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className="flex items-center">
              {notification.type === "success" ? (
                <Check className="h-5 w-5 text-green-500 mr-3" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              )}
              <p className={notification.type === "success" ? "text-green-700" : "text-red-700"}>
                {notification.message}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="originalPrice"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
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
                required
              ></textarea>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Product Details</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Add a product detail"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddDetail}
                className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {formData.details.length > 0 && (
              <div className="space-y-2">
                {formData.details.map((detail, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <span>{detail}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color and Size Variants */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Color and Size Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Black, Red, Blue"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sizeOption) => (
                    <button
                      key={sizeOption}
                      type="button"
                      onClick={() => handleToggleSize(sizeOption)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        sizes.includes(sizeOption)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddColor}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                disabled={!color || quantity <= 0 || sizes.length === 0}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variant
              </button>
            </div>

            {/* Added Color Variants */}
            {images.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-sm font-medium text-gray-700">Added Variants</h3>
                {images.map((imageData, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="font-medium text-gray-700">
                          {imageData.color} ({imageData.quantity} units)
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
  {imageData.size.map((s) => (
    <span key={s} className="px-2 py-0.5 bg-gray-100 rounded-sm text-xs">
      {s}
    </span>
  ))}
</div>
</div>
<button
  type="button"
  onClick={() => handleRemoveColor(index)}
  className="text-red-600 hover:text-red-800"
>
  <X className="h-4 w-4" />
</button>
</div>

{/* Image Upload */}
<div className="mt-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Upload Images
  </label>
  <div className="flex items-center">
    <label
      htmlFor={`images-${index}`}
      className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
    >
      <Upload className="h-4 w-4 mr-2" />
      Select Images
    </label>
    <input
      id={`images-${index}`}
      type="file"
      multiple
      accept="image/*"
      className="hidden"
      onChange={(e) => handleAddImage(e, index)}
    />
  </div>
</div>

{/* Preview Images */}
{imageData.image.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-2">
    {imageData.image.map((img, imgIndex) => (
      <div key={imgIndex} className="relative w-20 h-20">
        <img
          src={URL.createObjectURL(img)}
          alt={`Product variant ${index}-${imgIndex}`}
          className="w-full h-full object-cover rounded-md"
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index, imgIndex)}
          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    ))}
  </div>
)}
</div>
))}
</div>
)}
</div>

{/* Submit Button */}
<div className="pt-4">
  <button
    type="submit"
    disabled={loading || productAdded}
    className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white ${
      loading || productAdded
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
{/* Helper text */}
<div className="mt-4 p-4 bg-blue-50 rounded-md">
  <div className="flex items-start">
    <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
    <div>
      <p className="text-sm text-blue-800">
        Tips for adding products:
      </p>
      <ul className="list-disc pl-5 mt-1 text-xs text-blue-700 space-y-1">
        <li>Add high-quality images from multiple angles for each variant</li>
        <li>Provide detailed and accurate product descriptions</li>
        <li>Include all available sizes and accurate inventory counts</li>
        <li>Check all details before submitting the product</li>
      </ul>
    </div>
  </div>
</div>
</div>
);
};

export default AdminProductForm;