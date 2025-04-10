import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, MapPin, Package, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../zustand/useCart';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  // Determine if we're coming from "Buy Now" or cart checkout
  const singleProduct = location.state?.product;
  const isBuyNow = !!singleProduct;
  
  // Create a products array based on source
  const [products, setProducts] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  
  useEffect(() => {
    if (isBuyNow && singleProduct) {
      // Handle Buy Now flow with one product
      const buyNowItem = {
        id: singleProduct._id || Date.now(),
        name: singleProduct.name,
        price: singleProduct.images[0].price,
        quantity: location.state?.quantity || 1,
        image: location.state?.image || singleProduct.images[0].image[0], 
        color: location.state?.color || singleProduct.images[0].color,
        size: location.state?.size || singleProduct.images[0].size[0]
      };
      setProducts([buyNowItem]);
      setOrderTotal(buyNowItem.price * buyNowItem.quantity);
    } else {
      // Handle cart checkout flow with multiple products
      if (cartItems && cartItems.length > 0) {
        const mappedCartItems = cartItems.map(item => ({
          id: item.product._id || item.product.id,
          name: item.product.name,
          price: item.price || item.product.images[0].price,
          quantity: item.quantity,
          image: item.image || item.product.images[0].image[0],
          color: item.color,
          size: item.size
        }));
        setProducts(mappedCartItems);
        setOrderTotal(getCartTotal ? getCartTotal() : calculateTotalManually(mappedCartItems));
      } else {
        // Redirect to cart if there are no items
        navigate('/customer/cart');
      }
    }
  }, [location, cartItems]);

  const calculateTotalManually = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoBack = () => {
    if (isBuyNow) {
      // Go back to product page
      navigate(-1);
    } else {
      // Go back to cart
      navigate('/customer/cart');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would make an API call to process the order
      console.log('Order submitted:', { 
        items: products, 
        customerDetails: formData,
        totalAmount: orderTotal,
        isBuyNow: isBuyNow
      });
      
      // Show success message
      alert('Order placed successfully!');
      
      // Clear cart if coming from cart
      if (!isBuyNow && clearCart) {
        await clearCart();
      }
      
      // Redirect to order confirmation
      navigate('/customer/order-confirmation', {
        state: {
          orderNumber: `ORD-${Date.now()}`,
          orderAmount: orderTotal,
          customerName: `${formData.firstName} ${formData.lastName}`
        }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="mx-auto p-6 bg-wineRed min-h-screen">
      {/* Back button */}
      <button 
        onClick={handleGoBack}
        className="flex items-center mb-6 text-mustard hover:text-white transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Back to {isBuyNow ? 'Product' : 'Cart'}</span>
      </button>
      
      <h1 className="text-3xl font-bold mb-8 text-center text-mustard mt-6">
        {isBuyNow ? 'Buy Now Checkout' : 'Cart Checkout'}
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-wineRed">
            <Package className="mr-2 text-mustard" /> Order Summary
          </h2>
          
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items in your order.</p>
            </div>
          ) : (
            <>
              {products.map(item => (
                <div key={item.id} className="flex items-center mb-4 pb-4 border-b border-gray-200 bg-wineRed rounded-lg p-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 mr-6 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-lg text-mustard">{item.name}</p>
                    <div className="flex flex-col md:flex-row justify-between md:items-center">
                      <div>
                        <p className="text-mustard">Quantity: {item.quantity}</p>
                        <p className="text-mustard">Color: {item.color}</p>
                        <p className="text-mustard">Size: {item.size}</p>
                      </div>
                      <p className="font-bold text-mustard text-lg md:text-right mt-2 md:mt-0">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Order Summary Totals */}
              <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-wineRed">
                  <span>Subtotal</span>
                  <span>₹{orderTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-wineRed">
                  <span>Shipping</span>
                  <span>₹{orderTotal > 500 ? '0.00' : '50.00'}</span>
                </div>
                <div className="flex justify-between text-wineRed">
                  <span>Tax</span>
                  <span>₹{(orderTotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-wineRed pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>₹{(orderTotal + (orderTotal > 500 ? 0 : 50) + (orderTotal * 0.18)).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Estimated Delivery */}
              <div className="mt-6 bg-gray-100 p-4 rounded-md flex items-start">
                <Truck className="w-5 h-5 text-wineRed mr-2" />
                <div className="flex-1">
                  <h3 className="font-medium text-wineRed">Estimated Delivery</h3>
                  <p className="text-sm text-wineRed">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-wineRed">
            <MapPin className="mr-2 text-mustard" /> Shipping Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="firstName" 
              placeholder="First Name" 
              value={formData.firstName}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
              required 
            />
            <input 
              type="text" 
              name="lastName" 
              placeholder="Last Name" 
              value={formData.lastName}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
              required 
            />
          </div>
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
            required 
          />
          <input 
            type="text" 
            name="address" 
            placeholder="Street Address" 
            value={formData.address}
            onChange={handleInputChange}
            className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
            required 
          />
          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="city" 
              placeholder="City" 
              value={formData.city}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
              required 
            />
            <input 
              type="text" 
              name="zipCode" 
              placeholder="Zip Code" 
              value={formData.zipCode}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
              required 
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 flex items-center text-wineRed">
            <CreditCard className="mr-2 text-mustard" /> Payment Method
          </h2>
          <select 
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full p-3 border border-wineRed rounded-md focus:outline-none focus:ring-2 text-wineRed bg-white"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="applePay">Apple Pay</option>
            <option value="cashOnDelivery">Cash on Delivery</option>
          </select>

          {formData.paymentMethod === 'creditCard' && (
            <div className="space-y-4">
              <input 
                type="text" 
                name="cardNumber" 
                placeholder="Card Number" 
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
                required 
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="expiryDate" 
                  placeholder="MM/YY" 
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
                  required 
                />
                <input 
                  type="text" 
                  name="cvv" 
                  placeholder="CVV" 
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-white border border-wineRed text-wineRed placeholder:text-wineRed"
                  required 
                />
              </div>
            </div>
          )}

          {/* Order Summary for small screens */}
          <div className="lg:hidden mt-4">
            <div className="flex justify-between font-bold">
              <span>Order Total:</span> 
              <span>₹{(orderTotal + (orderTotal > 500 ? 0 : 50) + (orderTotal * 0.18)).toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Including tax and shipping</div>
          </div>

          {/* T&C Checkbox */}
          <div className="flex items-start mt-4">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 border-gray-300 rounded text-wineRed focus:ring-wineRed mt-1"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-wineRed">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full p-3 bg-wineRed text-mustard font-bold rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
            disabled={products.length === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Place Order (₹{(orderTotal + (orderTotal > 500 ? 0 : 50) + (orderTotal * 0.18)).toFixed(2)})
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;