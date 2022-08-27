import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddressItem from "../components/AddressItem";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  getAllAddresses,
  deleteReset,
  defaultReset,
  editReset,
  createReset,
} from "../features/shipping/shippingSlice";
import AddressForm from "../components/AddressForm";
import Loader from "../components/Loader";
import Message from "../components/Message";

function AddressScreen() {
  const dispatch = useDispatch();
  const {
    addresses,
    isLoading,
    deleteAddressSuccess,
    editAddressSuccess,
    createAddressSuccess,
    defaultAddressSuccess,
  } = useSelector((state) => state.shipping);
  const currentAddress = JSON.parse(
    window.sessionStorage.getItem("currentAddress")
  );

  useEffect(() => {
    dispatch(getAllAddresses());
    if (deleteAddressSuccess) {
      dispatch(deleteReset());
    }
    if (editAddressSuccess) {
      dispatch(editReset());
    }
    if (defaultAddressSuccess) {
      dispatch(defaultReset());
    }
    if (createAddressSuccess) {
      dispatch(createReset());
    }
  }, [
    dispatch,
    deleteAddressSuccess,
    editAddressSuccess,
    createAddressSuccess,
    defaultAddressSuccess,
  ]);
  const prevRoute = useLocation();

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
