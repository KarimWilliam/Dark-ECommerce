import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createAddress,
  createReset,
  editAddress,
  getAddress,
  getAddressReset,
  editReset,
} from "../features/shipping/shippingSlice";
import { useNavigate, Link, useParams } from "react-router-dom";
import Message from "./Message";

function AddressForm({ prevPage }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); //get id from the paramaters of the url
  const {
    getAddressSuccess,
    getAddressTarget,
    editAddressError,
    editAddressMessage,
    createAddressSuccess,
    createAddressMessage,
    createAddressError,
    editAddressSuccess,
  } = useSelector((state) => state.shipping);
  useEffect(() => {
    if (id) {
      dispatch(getAddress(id));
    }
  }, [dispatch]);

  useEffect(() => {
    if (getAddressSuccess) {
      setName(getAddressTarget.name);
      setAddress(getAddressTarget.address);
      setCity(getAddressTarget.city);
      setCountry(getAddressTarget.country);
      setPhone(getAddressTarget.phoneNumber);
      setPostal(getAddressTarget.postalCode);
    }
    dispatch(getAddressReset());
  }, [dispatch, getAddressSuccess]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [postal, setPostal] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    if (id) {
      const data = {
        id,
        address: {
          name: name,
          address: address,
          city: city,
          postalCode: postal,
          country: country,
          phoneNumber: phone,
        },
      };
      dispatch(editAddress(data));
    } else {
      dispatch(
        createAddress({
          name,
          address,
          city,
          postalCode: postal,
          country,
          phoneNumber: phone,
        })
      );
    }
  };

  useEffect(() => {
    if (createAddressSuccess || editAddressSuccess) {
      console.log("routing to: " + prevPage.prevRoute.pathname);
      navigate(prevPage.prevRoute.pathname);
      dispatch(createReset);
      dispatch(editReset);
      setName("");
      setAddress("");
      setCity("");
      setCountry("");
      setPhone("");
      setPostal("");
    }
  }, [createAddressSuccess, navigate, dispatch, editReset, editAddressSuccess]);

  const clearFields = () => {
    setName("");
    setAddress("");
    setCity("");
    setCountry("");
    setPhone("");
    setPostal("");
  };
  return (
    <section className="form-control">
      {createAddressError && (
        <Message variant="danger">{createAddressMessage}</Message>
      )}
      {editAddressError && (
        <Message variant="danger">{editAddressMessage}</Message>
      )}
      <Link to={prevPage.prevRoute.pathname}>
        <button onClick={clearFields}>Go Back</button>
      </Link>

      <form onSubmit={onSubmit}>
        <div className="">
          <label htmlFor="text"> </label>
          <input
            placeholder="name..."
            type="name"
            name="name"
            id="name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="text"> </label>
          <input
            placeholder="street and apt..."
            type="textarea"
            name="address"
            id="address"
            value={address || ""}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="text"> </label>
          <input
            placeholder="city..."
            type="city"
            name="city"
            id="city"
            value={city || ""}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="text"> </label>
          <input
            placeholder="country..."
            type="country"
            name="country"
            id="country"
            value={country || ""}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="text"> </label>
          <input
            placeholder="phone..."
            type="phone"
            name="phone"
            id="phone"
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="text"> </label>
          <input
            placeholder="postal Code..."
            type="postal"
            name="postal"
            id="postal"
            value={postal || ""}
            onChange={(e) => setPostal(e.target.value)}
          />
        </div>

        <div className="">
          <button className="btn btn-block btn-dark " type="submit">
            {id ? <div>Edit</div> : <div>Add Address</div>}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddressForm;
