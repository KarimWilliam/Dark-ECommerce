import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
function PPSPC() {
  const PPOptions = {
    "client-id":
      "AXBV1gKvd3Au-f6BFN8jR9JZO0PkhFmh-7dFFr2ZSqOoSc8a-YXwENxHKwH_cov58Kt4xMv2uzIz-aGj",
  };

  return <PayPalScriptProvider options={PPOptions}></PayPalScriptProvider>;
}

export default PPSPC;
