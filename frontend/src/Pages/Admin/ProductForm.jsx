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

// Import image compression library
import imageCompression from "browser-image-compression";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionProgress, setCompressionProgress] = useState({ show: false, file: "", progress: 0 });

  // Available size options
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

  // Image compression function
  const compressImage = async (imageFile) => {
    // If image is less than 1MB, return it as is
    if (imageFile.size <= 1024 * 1024) {
      return imageFile;
    }

    setCompressionProgress({ 
      show: true, 
      file: imageFile.name, 
      progress: 0 
    });

    const options = {
      maxSizeMB: 3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (percent) => {
        setCompressionProgress(prev => ({ 
          ...prev, 
          progress: percent 
        }));
      }
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      
      // Create a new file with the original name but compressed data
      const compressedBlob = new File(
        [compressedFile], 
        imageFile.name, 
        { type: imageFile.type }
      );
      
      console.log(`Original size: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB, Compressed: ${(compressedBlob.size / 1024 / 1024).toFixed(2)}MB`);
      
      setCompressionProgress({ show: false, file: "", progress: 0 });
      return compressedBlob;
    } catch (error) {
      console.error("Error compressing image:", error);
      setCompressionProgress({ show: false, file: "", progress: 0 });
      return imageFile; // Return original if compression fails
    }
  };

  const getImageLink = async (image) => {
    // Check if image is valid
    if (!image || !(image instanceof File)) {
      console.error("Invalid image:", image);
      return null;
    }
    
    // Compress image regardless of size
    const processedImage = await compressImage(image);
    
    // Check compressed file size - Cloudinary has limits
    if (processedImage.size > 10 * 1024 * 1024) { // 10MB limit after compression
      console.error("Image still too large after compression:", processedImage.name, processedImage.size);
      return null;
    }
    
    const formData = new FormData();
    formData.append("file", processedImage);
    formData.append("upload_preset", "preset1");
    formData.append("cloud_name", "dxuywp3zi");
  
    // Implement retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`Uploading image ${processedImage.name}, attempt ${attempts + 1}`);
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dxuywp3zi/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }
        );
        console.log("Image uploaded successfully:", response.data.secure_url);
        return response.data.secure_url;
      } catch (error) {
        attempts++;
        console.error(`Upload attempt ${attempts} failed:`, error.response?.data || error.message);
        
        if (attempts >= maxAttempts) {
          console.error("Max attempts reached for image:", processedImage.name);
          return null;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    
    try {
      // Count total images to upload for progress tracking
      let totalImages = 0;
      let uploadedImages = 0;
      
      imageVariants.forEach(variant => {
        variant.images.forEach(img => {
          if (!(typeof img === 'string')) {
            totalImages++;
          }
        });
      });
      
      // Upload images for each variant
      const processedVariants = [];
      
      for (const variant of imageVariants) {
        const uploadedImageLinks = [];
        
        // Process images sequentially
        for (const file of variant.images) {
          if (typeof file === 'string') {
            uploadedImageLinks.push(file); // Already uploaded
          } else {
            // Add delay between uploads
            const imageUrl = await getImageLink(file);
            if (imageUrl) {
              uploadedImageLinks.push(imageUrl);
            }
            
            // Update progress
            uploadedImages++;
            setUploadProgress(Math.round((uploadedImages / totalImages) * 100));
            
            // Small delay between uploads to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        }
        
        // Only include variants with at least one image
        if (uploadedImageLinks.length > 0) {
          processedVariants.push({
            color: variant.color,
            quantity: variant.quantity,
            image: uploadedImageLinks,
            size: variant.sizes,
            price: variant.price,
            originalPrice: variant.originalPrice,
          });
        }
      }

      // Check if we have valid processed variants
      if (processedVariants.length === 0) {
        throw new Error("No images could be uploaded. Please try again.");
      }

      const productData = {
        ...formData,
        images: processedVariants,
      };

      console.log("Saving product data:", productData);
      const response = await axios.post("https://lcnfyb0s62.execute-api.ap-south-1.amazonaws.com/api/products/save", productData,{
        withCredentials:true
      });
      
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
        setProductAdded(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      setNotification({
        show: true,
        message: error.message || "Error adding product. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
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

  const handleAddImage = async (e) => {
    const filesArray = Array.from(e.target.files);
    
    // Validate images before adding them
    const validFiles = filesArray.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        console.error("Invalid file type:", file.type);
      }
      return isValid;
    });
    
    console.log("Valid files selected:", validFiles.length);
    
    if (validFiles.length > 0) {
      setCurrentVariant({
        ...currentVariant,
        images: [...currentVariant.images, ...validFiles]
      });
    }
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
    <div className="bg-gray-50 min-h-screen text-black p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center border-b pb-4 mb-6">
          <Package className="h-6 w-6 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        </div>

        {notification.show && (
          <div className={`mb-4 p-3 rounded-md flex items-center ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <Check className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {compressionProgress.show && (
          <div className="mb-4 p-3 rounded-md bg-blue-100 text-blue-800">
            <div className="flex items-center mb-1">
              <Info className="h-5 w-5 mr-2" />
              <span>Compressing image: {compressionProgress.file}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${compressionProgress.progress}%` }}
              ></div>
            </div>
          </div>
        )}

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
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                className="w-full px-3 py-2 border textarea textarea-lg bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Images ({currentVariant.images.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentVariant.images.map((img, imgIndex) => (
                    <div key={imgIndex} className="relative w-20 h-20">
                      <img
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        alt={`Variant image ${imgIndex}`}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          console.error("Image failed to load", img);
                          e.target.src = "https://via.placeholder.com/80?text=Error";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imgIndex)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {!(typeof img === 'string') && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-0.5 text-center">
                          {(img.size / (1024 * 1024)).toFixed(1)}MB
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                {editingVariantIndex !== null ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Update Variant
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Variant
                  </>
                )}
              </button>
            </div>

            {/* Added Variants List */}
            {imageVariants.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Added Variants ({imageVariants.length})</h3>
                {imageVariants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-700">
                          {variant.color} - ₹{variant.price}
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
                    {/* Preview of variant images */}
                    {variant.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {variant.images.slice(0, 4).map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                            alt={`${variant.color} preview ${imgIndex}`}
                            className="w-10 h-10 object-cover rounded-sm"
                          />
                        ))}
                        {variant.images.length > 4 && (
                          <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center text-xs text-gray-500">
                            +{variant.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {loading && uploadProgress > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Uploading images... {uploadProgress}%
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || productAdded || imageVariants.length === 0}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white ${
                (loading || productAdded || imageVariants.length === 0)
                  ? "bg-gray-400 hover:cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Product...
                </span>
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