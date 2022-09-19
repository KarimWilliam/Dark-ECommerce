import React, { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

const SearchBox = () => {
  // eslint-disable-next-line
  let [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSearchParams({ keyword: keyword });

      //navigate("/search");
      //navigate(`/${keyword}`);
      // navigate({ pathname: "/", search: `?keyword=${keyword}` });
      //window.location.reload(false);
    } else {
      navigate(location.pathname);
      window.location.reload(false); //iffy
    }
  };

  return (
    <form onSubmit={submitHandler} style={{ flex: 1 }}>
      <div
        className="input-group "
        style={{
          flexWrap: "nowrap",
          minWidth: "200px",
        }}>
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search Products..."
          maxLength="100"
          className="form-control"
          style={{ float: "right" }}
        />
        <button
          className="btn p-2 secondary-color"
          type="submit"
          name="seach button">
          <i className="fa-solid fa-magnifying-glass black-color-in"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
