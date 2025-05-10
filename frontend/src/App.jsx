import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminLogin from "./Pages/Admin/AdminLogin";
import ProductEdit from "./Pages/Admin/ProductEdit";
import ProductView from "./Pages/Admin/ProductView";
import Cart from "./Pages/customer/cart";
import CashfreeRedirect from "./Pages/customer/CashfreeRedirect";
import Checkout from "./Pages/customer/Checkout";
import CustomerLayout from "./Pages/customer/CustomerLayout";
import CustomerLogin from "./Pages/customer/CustomerLogin";
import CustomerSignUp from "./Pages/customer/CustomerSignUp";
import LandingPage from "./Pages/customer/LandingPage";
import Notifications from "./Pages/customer/Notifications";
import OrderConfirmation from "./Pages/customer/OrderConfirmation";
import OrderDetailsPage from "./Pages/customer/OrderDetailsPage";
import OrderHistoryPage from "./Pages/customer/OrderHistoryPage";
import OtpVerification from "./Pages/customer/otpVerification";
import PaymentFailed from "./Pages/customer/PaymentFailed";
import Product from "./Pages/customer/Product";
import ProductList from "./Pages/customer/ProductList";
import Profile from "./Pages/customer/Profile";
import ShippingStatus from "./Pages/customer/ShippingStatus";
import Wishlist from "./Pages/customer/Wishlist";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={"/customer"} />} />

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="sign-up" element={<CustomerSignUp />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="otp-verification" element={<OtpVerification />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="shipping-status" element={<ShippingStatus />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="order/:orderId" element={<OrderDetailsPage />} />{" "}
          {/* New route for order details */}
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="payment/redirect" element={<CashfreeRedirect />} />
          <Route path="payment-failed" element={<PaymentFailed />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="login" element={<AdminLogin />} />
          <Route
            path="products/view/:productId/:variantIndex"
            element={<ProductView />}
          />
          <Route
            path="products/edit/:productId/:variantIndex"
            element={<ProductEdit />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
