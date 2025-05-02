import React, { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { useProduct } from '../../zustand/useProducts.jsx';
import { useCart } from '../../zustand/useCart';
import { useWishlist } from '../../zustand/useWishlist';
import { useOrders } from '../../zustand/useOrders.jsx';
const CustomerLayout = () => {
  const {fetchProductsIfEmpty} = useProduct();
  const initialized = useRef(false);
  const { fetchCart } = useCart();
  const {fetchWishlist}=useWishlist()
  const {fetchOrders} = useOrders()
  useEffect(() => {
    if (!initialized.current) {
      fetchProductsIfEmpty();
      initialized.current = true;
    }
    if(localStorage.getItem('token')){
      fetch
      fetchCart();
      fetchWishlist()
      fetchOrders()
    }
      
  }, [fetchProductsIfEmpty,fetchCart,fetchWishlist]);

  return (
    <div className='scrollbar-hide'>
        <Outlet></Outlet>
    </div>
  )
}

export default CustomerLayout