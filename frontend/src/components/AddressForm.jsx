import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
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
import { CountryDropdown } from "react-country-region-selector"; //RegionDropdown

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
  }, [dispatch, id]);

  useEffect(() => {
    if (getAddressSuccess) {
      setName(getAddressTarget.name);
      setAddress(getAddressTarget.address);
      setCity(getAddressTarget.city);
      setCountry(getAddressTarget.country);
      setPhone(String(getAddressTarget.phoneNumber));
      setPostal(getAddressTarget.postalCode);
    }
    dispatch(getAddressReset());
    // eslint-disable-next-line
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
          phoneNumber: String(phone),
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
      //console.log("routing to: " + prevPage.prevRoute.pathname);
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
    // eslint-disable-next-line
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
    <>
      <Link to={prevPage.prevRoute.pathname}>
        <button
          className="btn btn-light"
          onClick={clearFields}
          style={{ backgroundColor: "white" }}>
          Go Back
        </button>
      </Link>
      {createAddressError && (
        <Message variant="danger">{createAddressMessage}</Message>
      )}
      {editAddressError && (
        <Message variant="danger">{editAddressMessage}</Message>
      )}
      <section className="form-group">
        <form onSubmit={onSubmit}>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              placeholder="Name..."
              type="name"
              name="name"
              id="name"
              style={{ backgroundColor: "rgb(255, 255, 255)" }}
              maxLength={20}
              value={city || ""}
              onChange={(e) => setName(e.target.value)}
            />
            <label> Full Name</label>
          </div>

          <div className="">
            <label htmlFor="text"> </label>
            <CountryDropdown
              placeholder="country..."
              defaultOptionLabel="country..."
              type="country"
              name="country"
              id="country"
              value={country || ""}
              onChange={(e) => setCountry(e)}
              style={{
                textDecoration: "none",
                fontWeight: "normal",
                backgroundColor: "rgb(255, 255, 255)",
              }}
            />
          </div>
          <div className="form-floating mb-3">
            <input
              style={{ backgroundColor: "rgb(255, 255, 255)" }}
              className="form-control"
              placeholder="city..."
              type="city"
              name="city"
              id="city"
              maxLength={20}
              value={city || ""}
              onChange={(e) => setCity(e.target.value)}
            />
            <label> City</label>
          </div>

          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              type="textarea"
              name="address"
              id="address"
              style={{ minHeight: "100px", backgroundColor: "white" }}
              maxLength={300}
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label>Street &amp; Address</label>
          </div>
          <div className="">
            <label htmlFor="text"> </label>
            <PhoneInput
              placeholder="phone number..."
              type="phone"
              name="phone"
              id="phone"
              limitMaxLength
              value={phone || ""}
              defaultCountry="US"
              onChange={setPhone}
            />
          </div>

          <div className="form-floating mb-3">
            <input
              style={{ backgroundColor: "white" }}
              className="form-control"
              placeholder="postal/zip Code..."
              type="postal"
              name="postal"
              id="postal"
              maxLength={10}
              value={postal || ""}
              onChange={(e) => setPostal(e.target.value)}
            />
            <label> Postal/Zip Code</label>
          </div>

          <div className="">
            <button className="btn btn-block btn-dark " type="submit">
              {id ? <div>Edit</div> : <div>Add Address</div>}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default AddressForm;
