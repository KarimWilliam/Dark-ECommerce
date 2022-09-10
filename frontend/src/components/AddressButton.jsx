import { useDispatch } from "react-redux";
import { setCurrentAddress } from "../features/shipping/shippingSlice";

import { useNavigate } from "react-router-dom";

function AddressButton({ address }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onClick = (e) => {
    e.preventDefault();
    dispatch(setCurrentAddress(address));
    navigate("/placeorder");
  };

  return (
    <div className="container-lg  p-5 placeholder-glow">
      {address.default && <div>default</div>}
      <button onClick={onClick} className="col-md-8 text-center flex-nowrap ">
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
      </button>
    </div>
  );
}

export default AddressButton;
