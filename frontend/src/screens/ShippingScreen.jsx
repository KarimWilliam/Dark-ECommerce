import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  getAllAddresses,
  setCurrentAddress,
} from "../features/shipping/shippingSlice";
import { useLocation } from "react-router-dom";
import AddressForm from "../components/AddressForm";
import AddressItem from "../components/AddressItem";
import { Link } from "react-router-dom";
import AddressButton from "../components/AddressButton";

function ShippingScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const { addresses, defaultAddress } = useSelector((state) => state.shipping);

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);

  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };
  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);
  const prevRoute = useLocation();

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <div>
        Your Addresses
        <Link to="/Address/add" state={{ prevRoute }}>
          <br></br>
          <br></br>
          <button>Create New Address</button>
        </Link>
        <div className=" align-items-center  justify-content-between p-5 custombgcolor container-xxl">
          {addresses.length > 0 ? (
            <div className="addressess">
              {addresses.map((address) => (
                <AddressButton
                  key={address._id}
                  address={address}></AddressButton>
              ))}
            </div>
          ) : (
            <h3>There are no addresses to see</h3>
          )}
        </div>
      </div>
    </>
  );
}

export default ShippingScreen;
