import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import AddressScreen from "./screens/AddressScreen";
import AddAddressScreen from "./screens/AddAddressScreen";
import EditAddressScreen from "./screens/EditAddressScreen";
import DoesNotExist from "./screens/DoesNotExist";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import AboutScreen from "./screens/AboutScreen";

function App() {
  const payPalOptions = {
    "client-id":
      "AXBV1gKvd3Au-f6BFN8jR9JZO0PkhFmh-7dFFr2ZSqOoSc8a-YXwENxHKwH_cov58Kt4xMv2uzIz-aGj",
  };

  return (
    <PayPalScriptProvider options={payPalOptions}>
      <Router>
        <Header />
        <main className="py-3" style={{ backgroundColor: "#eaeded" }}>
          <div className="container " style={{ backgroundColor: "white" }}>
            <Routes>
              <Route path="/about" element={<AboutScreen />}></Route>
              <Route path="/order/:id" element={<OrderScreen />}></Route>
              <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>
              <Route path="/shipping" element={<ShippingScreen />}></Route>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/Login" element={<LoginScreen />} />
              <Route path="/Profile" element={<ProfileScreen />} />
              <Route path="/Register" element={<RegisterScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart/:id" element={<CartScreen />} />
              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route path="/Address/add" element={<AddAddressScreen />} />
              <Route path="/Address/edit/:id" element={<EditAddressScreen />} />
              <Route path="/Address" element={<AddressScreen />} />
              <Route
                path="/admin/productlist/:id"
                element={<UserListScreen />}
              />
              <Route
                path="/admin/product/:id/edit"
                element={<ProductEditScreen />}
              />
              <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route
                path="/resetPassword/:id/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/admin/productlist"
                element={<ProductListScreen />}
                exact
              />
              <Route
                path="/admin/productlist/:pageNumber"
                element={<ProductListScreen />}
                exact
              />
              <Route path="*" element={<DoesNotExist />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;

//Fake paypal user: sb-escqz20029148@personal.example.com  :,G})3:y
