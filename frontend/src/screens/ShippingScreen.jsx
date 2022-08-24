import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { getAllAddresses } from "../features/shipping/shippingSlice";

function ShippingScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const { addresses } = useSelector((state) => state.shipping);

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

  return (
    <>
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h3>Add a new address</h3>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Confirm
          </Button>
        </Form>
      </FormContainer>
    </>
  );
}

export default ShippingScreen;
