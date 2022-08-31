import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  deleteAddress,
  setDefaultAddress,
} from "../features/shipping/shippingSlice";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function AddressItem({ address }) {
  const prevRoute = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAddress = JSON.parse(
    window.localStorage.getItem("currentAddress")
  );
  const onDelete = (e) => {
    e.preventDefault();
    dispatch(deleteAddress(address._id));
  };
  const onEdit = (e) => {
    e.preventDefault();
    navigate("/Address/edit/" + address._id, { state: { prevRoute } });
  };
  const onDefault = (e) => {
    e.preventDefault();
    dispatch(setDefaultAddress(address._id));
  };

  return (
    <div className="container-lg  p-5 placeholder-glow">
      {address.default && <div>default</div>}
      <div className="col-md-8 text-center flex-nowrap ">
        <div className="row h-25  flex-md-nowrap">
          <div className="col-md-10 "> {address.name}</div>
        </div>
        <div className="row h-75  ">
          <div className="container-lg ">
            <p className="lead text-center d-flex justify-content-center align-items-center h-100 ">
              Address: {address.address}
            </p>
          </div>
        </div>
        <div className="row h-75  ">
          <div className="container-lg ">
            <p className="lead text-center d-flex justify-content-center align-items-center h-100 ">
              City: {address.city}
            </p>
          </div>
        </div>
        <div className="row h-75  ">
          <div className="container-lg ">
            <p className="lead text-center d-flex justify-content-center align-items-center h-100 ">
              Country: {address.country}
            </p>
          </div>
        </div>
        <div className="row h-75  ">
          <div className="container-lg ">
            <p className="lead text-center d-flex justify-content-center align-items-center h-100 ">
              Postal Code: {address.postalCode}
            </p>
          </div>
        </div>
        <div className="row h-75  ">
          <div className="container-lg ">
            <p className="lead text-center d-flex justify-content-center align-items-center h-100 ">
              Phone Number: {address.phoneNumber}
            </p>
          </div>
        </div>
      </div>
      <button className="btn  btn-dark " onClick={onDelete}>
        delete
      </button>
      <button className="btn btn-dark " onClick={onEdit}>
        edit
      </button>
      {!address.default && (
        <button className="btn btn-dark " onClick={onDefault}>
          set As default
        </button>
      )}
    </div>
  );
}

export default AddressItem;
