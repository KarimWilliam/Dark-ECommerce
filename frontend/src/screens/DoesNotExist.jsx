import React from "react";
import { Link } from "react-router-dom";
function DoesNotExist() {
  return (
    <>
      <Link to="/">
        <button
          className="btn "
          style={{ textAlight: "center", backgroundColor: "white" }}>
          <h5 className="btn">Back TO HOMEPAGE</h5>
        </button>
      </Link>
      <div className="p-5" style={{ textAlign: "center" }}>
        <h3 className="main-color-in" style={{ textTransform: "capitalize" }}>
          Whatever You were looking for doesnt seem to exist
        </h3>
      </div>
    </>
  );
}

export default DoesNotExist;
