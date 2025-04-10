import { useProduct } from '../../zustand/useProducts';
import { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ProductTable = () => {
  const { products, fetchProductsIfEmpty } = useProduct();
  const [expandedProducts, setExpandedProducts] = useState({});

  useEffect(() => {
    fetchProductsIfEmpty();
  }, [fetchProductsIfEmpty]);

  const toggleExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color Variant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Images</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sizes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y text-black divide-gray-200">
          {products.map((product) => (
            <>
              {/* Main Product Row */}
              <tr key={product._id} className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap" colSpan="8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button 
                        onClick={() => toggleExpand(product._id)}
                        className="mr-2 text-gray-500 hover:text-gray-700"
                      >
                        {expandedProducts[product._id] ? <ChevronUp /> : <ChevronDown />}
                      </button>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">ID: {product._id.slice(-5)}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.images.length} variants | Total Stock: {
                        product.images.reduce((sum, variant) => sum + (variant.quantity || 0), 0)
                      }
                    </div>
                  </div>
                </td>
              </tr>
              
              {/* Variant Rows */}
              {expandedProducts[product._id] && product.images.map((variant, index) => (
                <tr key={variant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="pl-8 text-sm text-gray-500">
                      Variant {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded-full border mr-2"
                        style={{ backgroundColor: variant.color.toLowerCase() }}
                      ></div>
                      <span className="text-sm font-medium">{variant.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {variant.image.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${product.name} ${variant.color} ${idx + 1}`}
                          className="h-10 w-10 rounded-md object-cover border border-gray-200"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {variant.size.map((size, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-md"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium">₹{variant.price}</div>
                      {variant.originalPrice > variant.price && (
                        <div className="text-xs text-gray-500 line-through">
                          ₹{variant.originalPrice}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{variant.quantity} units</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${variant.quantity > 20 ? 'bg-green-100 text-green-800' : 
                        variant.quantity > 5 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {variant.quantity > 20 ? 'In Stock' : 
                       variant.quantity > 5 ? 'Low Stock' : 'Critical Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Edit Variant"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete Variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
