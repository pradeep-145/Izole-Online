import React, { useState } from 'react';
import { CreditCard, Truck, MapPin, Package } from 'lucide-react';

const CheckoutPage = () => {
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

  const cartItems = [
    { id: 1, name: 'Wireless Headphones', price: 129.99, quantity: 1, image: '/api/placeholder/100/100' },
    { id: 2, name: 'Smart Watch', price: 199.99, quantity: 1, image: '/api/placeholder/100/100' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', { items: cartItems, customerDetails: formData });
  };

  return (
    <div className=" mx-auto p-6 bg-wineRed min-h-screen ">
      <h1 className="text-3xl font-bold mb-8 text-center text-mustard mt-10">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-wineRed">
            <Package className="mr-2 text-mustard" /> Order Summary
          </h2>
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center mb-4 pb-4 border-b border-gray-200 bg-wineRed rounded-lg">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 mr-6 object-cover rounded-lg shadow-md"
              />
              <div>
                <p className="font-bold text-lg text-mustard">{item.name}</p>
                <p className="text-mustard">Quantity: {item.quantity}</p>
                <p className="font-bold text-mustard">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-2xl text-wineRed mt-4">
            Total: ${calculateTotal()}
          </div>
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
              className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
              required 
            />
            <input 
              type="text" 
              name="lastName" 
              placeholder="Last Name" 
              value={formData.lastName}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
              required 
            />
          </div>
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
            required 
          />
          <input 
            type="text" 
            name="address" 
            placeholder="Street Address" 
            value={formData.address}
            onChange={handleInputChange}
            className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
            required 
          />
          <div className="grid md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="city" 
              placeholder="City" 
              value={formData.city}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
              required 
            />
            <input 
              type="text" 
              name="zipCode" 
              placeholder="Zip Code" 
              value={formData.zipCode}
              onChange={handleInputChange}
              className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
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
            className="w-full p-3 border border-wineRed rounded-md focus:outline-none focus:ring-2 text-wineRed bg-mustard"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="applePay">Apple Pay</option>
          </select>

          {formData.paymentMethod === 'creditCard' && (
            <div className="space-y-4">
              <input 
                type="text" 
                name="cardNumber" 
                placeholder="Card Number" 
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
                required 
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="expiryDate" 
                  placeholder="MM/YY" 
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
                  required 
                />
                <input 
                  type="text" 
                  name="cvv" 
                  placeholder="CVV" 
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-mustard border border-wineRed text-wineRed placeholder:text-wineRed"
                  required 
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full p-3 bg-wineRed text-mustard font-bold rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;