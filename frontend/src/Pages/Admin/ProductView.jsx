import { ChevronLeft, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../zustand/useProducts.jsx";

const ProductView = () => {
  const { productId, variantIndex } = useParams();
  const { products, fetchProductsIfEmpty } = useProduct();
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      await fetchProductsIfEmpty();

      const foundProduct = products.find((p) => p._id === productId);
      if (
        foundProduct &&
        foundProduct.variants &&
        foundProduct.variants[variantIndex]
      ) {
        setProduct(foundProduct);
        setVariant(foundProduct.variants[variantIndex]);
        setMainImage(foundProduct.variants[variantIndex].images[0] || "");
      }
    };

    loadProduct();
  }, [productId, variantIndex, products, fetchProductsIfEmpty]);

  // Calculate total stock
  const calculateTotalStock = () => {
    if (!variant || !variant.sizeOptions) return 0;
    return variant.sizeOptions.reduce((sum, size) => sum + size.quantity, 0);
  };

  if (!product || !variant) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading product details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin ")}
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        </div>
        <button
          onClick={() =>
            navigate(`/admin/products/edit/${productId}/${variantIndex}`)
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" /> Edit Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="w-full md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-md border border-gray-200"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {variant.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(image)}
                    className={`w-20 h-20 rounded-md border ${
                      mainImage === image
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {product.name}
                </h2>
                <div className="flex items-center mb-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    Product ID: {productId.slice(-5)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{product.description}</p>

                <div className="flex items-center mb-4">
                  <div className="mr-2">Color:</div>
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full border mr-2"
                      style={{ backgroundColor: variant.color.toLowerCase() }}
                    ></div>
                    <span>{variant.color}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-2">Available Sizes:</div>
                  <div className="flex flex-wrap gap-2">
                    {variant.sizeOptions.map((sizeOption, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="px-4 py-2 bg-gray-100 rounded-md font-medium">
                          {sizeOption.size}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {sizeOption.quantity} in stock
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-baseline mb-4">
                  <div className="text-2xl font-bold text-gray-900 mr-2">
                    ₹{variant.sizeOptions[0].price}
                  </div>
                  {variant.sizeOptions[0].originalPrice >
                    variant.sizeOptions[0].price && (
                    <div className="text-lg text-gray-500 line-through">
                      ₹{variant.sizeOptions[0].originalPrice}
                    </div>
                  )}
                </div>

                <div className="flex items-center mb-4">
                  <div className="text-gray-700 mr-2">Total Stock:</div>
                  <div className="font-medium">
                    {calculateTotalStock()} units
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="font-medium mb-2">Product Information:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Category:</div>
                    <div>{product.category}</div>
                    <div className="text-gray-600">Added on:</div>
                    <div>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-gray-600">Last updated:</div>
                    <div>
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-gray-600">Order Count:</div>
                    <div>{product.orderCount || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
