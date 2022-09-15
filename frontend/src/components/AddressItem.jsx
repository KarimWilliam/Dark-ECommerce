import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddress,
  setDefaultAddress,
} from "../features/shipping/shippingSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { defaultReset, reset } from "../features/shipping/shippingSlice";

function AddressItem({ address }) {
  const prevRoute = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onDelete = (e) => {
    e.preventDefault();
    dispatch(deleteAddress(address._id));
  };
  const onEdit = (e) => {
    e.preventDefault();
    navigate("/Address/edit/" + address._id, { state: { prevRoute } });
  };
  const onDefault = (e) => {
    setGreyOut(" grey-out");
    e.preventDefault();
    dispatch(setDefaultAddress(address._id));
  };
  const [greyOut, setGreyOut] = useState("  ");
  const { defaultAddressSuccess, isSuccess } = useSelector(
    (state) => state.shipping
  );

  useEffect(() => {
    if (isSuccess) {
      console.log(isSuccess);
      setGreyOut(" ");
    }
    dispatch(defaultReset());
    dispatch(reset());
  }, [isSuccess, dispatch]);

  return (
    <ul className={greyOut + " popping-font address-item "}>
      {address.default && (
        <p style={{ fontWeight: "600" }} className="secondary-color-in">
          Default Address
        </p>
      )}

      <p style={{ fontWeight: "bold" }}>{address.name}</p>

      <p>
        <span style={{ fontWeight: "600" }}>Address:</span> {address.address}
      </p>

      <p>
        <span style={{ fontWeight: "600" }}>City:</span> {address.city}
      </p>

      <p>
        <span style={{ fontWeight: "600" }}>Country: </span>
        {address.country}
      </p>

      <p>
        <span style={{ fontWeight: "600" }}>Postal Code: </span>
        {address.postalCode}
      </p>

      <p>
        <span style={{ fontWeight: "600" }}>Phone Number: </span>
        {address.phoneNumber}
      </p>
      <div
        style={{
          justifyContent: "space-evenly",
          display: "flex",
          gap: "10px",
          whiteSpace: "nowrap",
        }}>
        <button
          className="btn  btn-dark "
          style={{ flex: 1 }}
          onClick={onDelete}>
          delete
        </button>
        <button style={{ flex: 1 }} className="btn btn-dark " onClick={onEdit}>
          edit
        </button>
        {!address.default && (
          <button
            className="btn btn-dark "
            style={{ flex: 1 }}
            onClick={onDefault}>
            set As default
          </button>
        )}
      </div>
    </ul>
  );
}

export default AddressItem;
