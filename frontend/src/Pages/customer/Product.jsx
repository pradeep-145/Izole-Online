import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  return (
    <div>
      <Navbar></Navbar>
    </div>
  );
};

export default Product;
