import { Link } from "react-router-dom";

function AddressButton({ address }) {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const onClick = (e) => {
  //   e.preventDefault();
  //   dispatch(setCurrentAddress(address));
  //   navigate("/placeorder");
  // };

  return (
    <Link
      to="/placeorder"
      className="address-item popping-font  address-hover-effect"
      style={{ textDecoration: "none", minWidth: "350px" }}>
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
    </Link>
  );
}

export default AddressButton;
