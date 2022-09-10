import React from "react";
import AddressForm from "../components/AddressForm";
import { useLocation } from "react-router-dom";
function AddAddressScreen() {
  return (
    <div>
      <AddressForm prevPage={useLocation().state} />
    </div>
  );
}

export default AddAddressScreen;
