import React from "react";
import AddressForm from "../components/AddressForm";
import { useLocation } from "react-router-dom";
function EditAddressScreen() {
  const { state } = useLocation();

  return (
    <div>
      <AddressForm prevPage={state} />
    </div>
  );
}

export default EditAddressScreen;
