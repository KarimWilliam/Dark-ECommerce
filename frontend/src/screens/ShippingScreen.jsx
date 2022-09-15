import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { getAllAddresses } from "../features/shipping/shippingSlice";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import AddressButton from "../components/AddressButton";

function ShippingScreen() {
  const { addresses } = useSelector((state) => state.shipping);

  const dispatch = useDispatch();

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   // dispatch(saveShippingAddress({ address, city, postalCode, country }));
  //   navigate("/payment");
  // };

  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);
  const prevRoute = useLocation();

  return (
    <>
      <CheckoutSteps step1 step2 step4 high />
      <div>
        <h2 className="main-color-in">Ship Items To:</h2>
        <Link to="/Address/add" state={{ prevRoute }}>
          <br></br>
          <br></br>
          <button className="button-1">Create New Address</button>
        </Link>
        {addresses.length > 0 ? (
          <div className="address-container">
            {addresses.map((address) => (
              <AddressButton
                key={address._id}
                address={address}></AddressButton>
            ))}
          </div>
        ) : (
          <h4>
            You have no address saved.<br></br> Please{" "}
            <Link
              className="main-color-in"
              to="/Address/add"
              state={{ prevRoute }}>
              Submit
            </Link>{" "}
            a new one.
          </h4>
        )}
      </div>
    </>
  );
}

export default ShippingScreen;
