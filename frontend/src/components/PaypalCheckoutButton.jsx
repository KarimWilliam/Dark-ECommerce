import { PayPalButtons } from "@paypal/react-paypal-js";
const PaypalCheckoutButton = (props) => {
  const { amount } = props;

  return <PayPalButtons />;
};

export default PaypalCheckoutButton;
