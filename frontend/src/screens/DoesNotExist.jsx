import React from "react";
import { Link } from "react-router-dom";
function DoesNotExist() {
  return (
    <>
      <Link to="/">
        <button
          className="btn "
          style={{ textAlight: "center", backgroundColor: "white" }}>
          <h5>Back TO HOMEPAGE</h5>
        </button>
      </Link>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ textTransform: "capitalize" }}>
          Whatever You were looking for doesnt seem to exist
        </h3>
      </div>
    </>
  );
}

export default DoesNotExist;
