import React from "react";
import AddressForm from "../components/AddressForm";
import { useLocation } from "react-router-dom";
import { createReset } from "../features/shipping/shippingSlice";
function AddAddressScreen() {
  return (
    <div>
      <AddressForm prevPage={useLocation().state} />
    </div>
  );
}

export default AddAddressScreen;
