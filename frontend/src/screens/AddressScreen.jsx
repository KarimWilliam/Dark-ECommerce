import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddressItem from "../components/AddressItem";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllAddresses,
  deleteReset,
  defaultReset,
  editReset,
  createReset,
  setCurrentAddress,
} from "../features/shipping/shippingSlice";
import Loader from "../components/Loader";

function AddressScreen() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const prevRoute = useLocation();
  const dispatch = useDispatch();
  const {
    addresses,
    isLoading,
    deleteAddressSuccess,
    editAddressSuccess,
    createAddressSuccess,
    defaultAddressSuccess,
    defaultAddress,
  } = useSelector((state) => state.shipping);

  useEffect(() => {
    if (!user) {
      navigate("/login", { prevPage: prevRoute });
    }
    dispatch(getAllAddresses());
    if (deleteAddressSuccess) {
      dispatch(deleteReset());
    }
    if (editAddressSuccess) {
      dispatch(editReset());
    }
    if (defaultAddressSuccess) {
      setCurrentAddress(defaultAddress);
      window.localStorage.setItem(
        "currentAddress",
        JSON.stringify(defaultAddress)
      );
      dispatch(defaultReset());
    }
    if (createAddressSuccess) {
      dispatch(createReset());
    }
  }, [
    user,
    navigate,
    dispatch,
    prevRoute,
    defaultAddress,
    deleteAddressSuccess,
    editAddressSuccess,
    createAddressSuccess,
    defaultAddressSuccess,
  ]);

  if (isLoading) {
    return (
      <>
        Your Addresses <br></br> <Loader />
      </>
    );
  }

  return (
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
              <AddressItem key={address._id} address={address} />
            ))}
          </div>
        ) : (
          <h3>There are no addresses to see</h3>
        )}
      </div>
    </div>
  );
}

export default AddressScreen;
