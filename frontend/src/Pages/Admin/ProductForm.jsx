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
  Edit,
  ListPlus
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
    images: [],
    sizeOptions: [],
    details: []
  });

  // State for edited size option
  const [currentSizeOption, setCurrentSizeOption] = useState({
    size: "",
    quantity: 0,
    price: "",
    originalPrice: ""
  });

  // State for new detail
  const [newDetail, setNewDetail] = useState("");

  // New state for editing variants
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  // State for editing specific size option within a variant
  const [editingSizeOptionIndex, setEditingSizeOptionIndex] = useState(null);

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
            images: uploadedImageLinks,
            sizeOptions: variant.sizeOptions,
            details: variant.details || [],
          });
        }
      }

      // Check if we have valid processed variants
      if (processedVariants.length === 0) {
        throw new Error("No images could be uploaded. Please try again.");
      }

      const productData = {
        ...formData,
        variants: processedVariants,
      };

      console.log("Saving product data:", productData);
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

  // Handle adding a product detail to the current variant
  const handleAddDetail = () => {
    if (!newDetail.trim()) return;
    
    setCurrentVariant({
      ...currentVariant,
      details: [...(currentVariant.details || []), newDetail.trim()]
    });
    setNewDetail("");
  };

  // Handle removing a detail from the current variant
  const handleRemoveDetail = (index) => {
    const updatedDetails = [...(currentVariant.details || [])];
    updatedDetails.splice(index, 1);
    setCurrentVariant({
      ...currentVariant,
      details: updatedDetails
    });
  };

  // Handle adding or updating a size option
  const handleAddSizeOption = () => {
    if (!currentSizeOption.size || currentSizeOption.quantity <= 0 || !currentSizeOption.price || !currentSizeOption.originalPrice) return;
    
    if (editingSizeOptionIndex !== null) {
      // Update existing size option
      const updatedSizeOptions = [...currentVariant.sizeOptions];
      updatedSizeOptions[editingSizeOptionIndex] = { ...currentSizeOption };
      setCurrentVariant({
        ...currentVariant,
        sizeOptions: updatedSizeOptions
      });
      setEditingSizeOptionIndex(null);
    } else {
      // Add new size option
      setCurrentVariant({
        ...currentVariant,
        sizeOptions: [...currentVariant.sizeOptions, { ...currentSizeOption }]
      });
    }

    // Reset current size option
    setCurrentSizeOption({
      size: "",
      quantity: 0,
      price: "",
      originalPrice: ""
    });
  };

  // Handle editing a size option
  const handleEditSizeOption = (index) => {
    const sizeOptionToEdit = currentVariant.sizeOptions[index];
    setCurrentSizeOption({ ...sizeOptionToEdit });
    setEditingSizeOptionIndex(index);
  };

  // Handle removing a size option
  const handleRemoveSizeOption = (index) => {
    const updatedSizeOptions = [...currentVariant.sizeOptions];
    updatedSizeOptions.splice(index, 1);
    setCurrentVariant({
      ...currentVariant,
      sizeOptions: updatedSizeOptions
    });
  };

  const handleAddVariant = (e) => {
    e.preventDefault();
    
    // Validate current variant
    if (!currentVariant.color || 
        currentVariant.sizeOptions.length === 0 ||
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
      images: [],
      sizeOptions: [],
      details: []
    });
    
    // Reset current size option
    setCurrentSizeOption({
      size: "",
      quantity: 0,
      price: "",
      originalPrice: ""
    });
    
    // Reset editing states
    setEditingSizeOptionIndex(null);
  };

  const handleEditVariant = (index) => {
    const variantToEdit = imageVariants[index];
    setCurrentVariant({ ...variantToEdit });
    setEditingVariantIndex(index);
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
            
            {/* Variant Color Input */}
            <div className="mb-4">
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
            
            {/* Image Upload Section */}
            <div className="mb-4">
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
            </div>
            
            {/* Product Details Section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Product Details (Optional)</h3>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="flex-1 px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add product detail or feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDetail())}
                />
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {currentVariant.details && currentVariant.details.length > 0 && (
                <div className="mt-2 space-y-1">
                  {currentVariant.details.map((detail, index) => (
                    <div key={index} className="flex items-center justify-between py-1 px-3 bg-gray-50 rounded">
                      <span className="text-sm">{detail}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Size Options Section */}
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Size Options*</h3>
              
              {/* Size Option Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <label htmlFor="size" className="block text-xs font-medium text-gray-700 mb-1">
                    Size*
                  </label>
                  <select
                    id="size"
                    value={currentSizeOption.size}
                    onChange={(e) => setCurrentSizeOption({ ...currentSizeOption, size: e.target.value })}
                    className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select size</option>
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-xs font-medium text-gray-700 mb-1">
                    Quantity*
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={currentSizeOption.quantity}
                    onChange={(e) => setCurrentSizeOption({ ...currentSizeOption, quantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="sizePrice" className="block text-xs font-medium text-gray-700 mb-1">
                    Price*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      id="sizePrice"
                      value={currentSizeOption.price}
                      onChange={(e) => setCurrentSizeOption({ ...currentSizeOption, price: parseFloat(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="sizeOriginalPrice" className="block text-xs font-medium text-gray-700 mb-1">
                    Original Price*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      id="sizeOriginalPrice"
                      value={currentSizeOption.originalPrice}
                      onChange={(e) => setCurrentSizeOption({ ...currentSizeOption, originalPrice: parseFloat(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
              {/* Add/Update Size Option Button */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddSizeOption}
                  className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none"
                  disabled={
                    !currentSizeOption.size || 
                    currentSizeOption.quantity <= 0 || 
                    !currentSizeOption.price ||
                    !currentSizeOption.originalPrice
                  }
                >
                  {editingSizeOptionIndex !== null ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Update Size
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" />
                      Add Size
                    </>
                  )}
                </button>
              </div>
              
              {/* Size Options List */}
              {currentVariant.sizeOptions.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Added Sizes:</h4>
                  <div className="space-y-2">
                    {currentVariant.sizeOptions.map((sizeOpt, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                        <div className="text-sm">
                          <span className="font-medium">{sizeOpt.size}</span>
                          <span className="mx-2 text-gray-500">|</span>
                          <span>Qty: {sizeOpt.quantity}</span>
                          <span className="mx-2 text-gray-500">|</span>
                          <span>₹{sizeOpt.price}</span>
                          <span className="mx-1 text-gray-400">(Original: ₹{sizeOpt.originalPrice})</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditSizeOption(index)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSizeOption(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add/Update Variant Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                disabled={
                  !currentVariant.color || 
                  currentVariant.sizeOptions.length === 0 ||
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
                    <ListPlus className="h-4 w-4 mr-1" />
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
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-gray-800">
                        {variant.color} ({variant.sizeOptions.length} sizes)
                      </div>
                      <div className="flex items-center space-x-2">
                      <button
                          type="button"
                          onClick={() => handleEditVariant(index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Images:</h4>
                        <div className="flex flex-wrap gap-2">
                          {variant.images.slice(0, 3).map((img, imgIndex) => (
                            <div key={imgIndex} className="relative w-12 h-12">
                              <img
                                src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                alt={`Image ${imgIndex}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                          ))}
                          {variant.images.length > 3 && (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{variant.images.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Sizes:</h4>
                        <div className="flex flex-wrap gap-1">
                          {variant.sizeOptions.map((sizeOpt, sizeIndex) => (
                            <span key={sizeIndex} className="px-2 py-1 bg-gray-100 text-xs rounded">
                              {sizeOpt.size}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {variant.details && variant.details.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Details:</h4>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {variant.details.slice(0, 3).map((detail, detailIndex) => (
                            <li key={detailIndex}>{detail}</li>
                          ))}
                          {variant.details.length > 3 && (
                            <li>+{variant.details.length - 3} more details</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          {imageVariants.length > 0 ? (
            <div className="flex flex-col">
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Uploading images...</span>
                    <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className={`flex items-center justify-center px-6 py-3 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white rounded-md focus:outline-none`}
                disabled={loading || productAdded}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : productAdded ? (
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Product Added
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-5 w-5 mr-2" />
                    Save Product
                  </div>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p>Add at least one product variant to submit</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;