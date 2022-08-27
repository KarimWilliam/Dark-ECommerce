import React from "react";
import AddressForm from "../components/AddressForm";
import { useLocation, useParams } from "react-router-dom";
import { createReset } from "../features/shipping/shippingSlice";
function EditAddressScreen() {
  const { state } = useLocation();

  return (
    <div>
      <AddressForm prevPage={state} />
    </div>
  );
}

export default EditAddressScreen;
