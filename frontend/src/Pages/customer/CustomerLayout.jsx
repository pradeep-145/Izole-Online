import React, { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { useProduct } from '../../zustand/useProducts.jsx';
import { useCart } from '../../zustand/useCart';
import { useWishlist } from '../../zustand/useWishlist';

const CustomerLayout = () => {
  const {fetchProductsIfEmpty} = useProduct();
  const initialized = useRef(false);
  const { fetchCart } = useCart();
  const {fetchWishlist}=useWishlist()
  useEffect(() => {
    if (!initialized.current) {
      fetchProductsIfEmpty();
      initialized.current = true;
    }
    if(localStorage.getItem('token')){

      fetchCart();
      fetchWishlist()
    }
      
  }, [fetchProductsIfEmpty,fetchCart,fetchWishlist]);

  return (
    <div className='scrollbar-hide'>
        <Outlet></Outlet>
    </div>
  )
}

export default CustomerLayout