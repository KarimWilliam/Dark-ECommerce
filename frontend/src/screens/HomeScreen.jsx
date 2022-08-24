import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../features/products/productSlice"; //listproducts pagination
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSearchParams } from "react-router-dom";
import ProductCarousel from "../components/ProductsCarousel";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";

function HomeScreen() {
  const [searchParams] = useSearchParams({});
  const keyword = searchParams.get("keyword");
  const dispatch = useDispatch();
  const [alert, setAlert] = useState("");

  useEffect(() => {
    setAlert(localStorage.getItem("alert"));
    localStorage.removeItem("alert");
  }, []);

  useEffect(() => {
    dispatch(getProducts(keyword));
  }, [dispatch, keyword]);

  const { products, isLoading, error } = useSelector((state) => state.product);
  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      {alert && <Message variant="danger">{alert}</Message>}
      <h2>Latest Prodcuts</h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message varient="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default HomeScreen;
