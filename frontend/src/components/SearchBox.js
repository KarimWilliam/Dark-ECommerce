import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

const SearchBox = () => {
  let [setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSearchParams({ keyword: keyword });
      //navigate("/search");
      //navigate(`/search/${keyword}`);
      //navigate({ pathname: "/search", search: `?keyword=${keyword}` });
    } else {
      navigate(location.pathname);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
