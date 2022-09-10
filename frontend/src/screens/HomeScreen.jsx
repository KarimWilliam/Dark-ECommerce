import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useSelector, useDispatch } from "react-redux";
import { listProducts, resetPage } from "../features/products/productSlice"; //listproducts pagination
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSearchParams } from "react-router-dom";
import ProductCarousel from "../components/ProductsCarousel";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

function HomeScreen() {
  const observer = useRef();
  const [searchParams] = useSearchParams({});
  const keyword = searchParams.get("keyword");
  // const pageNumber = searchParams.get("pageNumber") || 1;
  const dispatch = useDispatch();
  const [alert, setAlert] = useState("");

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) {
        dispatch(resetPage());
        const x = 1;
        dispatch(listProducts({ currentPage: x, keyword }));
      } else {
        didMount.current = true;
      }
      //this is why i had to do the whole mounting thing presumebly. keyword is not being read
      // eslint-disable-next-line
    }, [keyword]);
  };

  useDidMountEffect(() => {
    console.log("second render");
  });

  useEffect(() => {
    setAlert(localStorage.getItem("alert"));
    localStorage.removeItem("alert");
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("scrollPosition")) {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (homeProducts.length) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        sessionStorage.removeItem("scrollPosition");
      }
    }
    // dispatch(getProducts(keyword));
    if (homeProducts.length === 0) {
      dispatch(resetPage());
      const x = 1;
      dispatch(listProducts({ currentPage: x, keyword }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isLoading, error, page, homeProducts, hasMore } = useSelector(
    (state) => state.product
  );

  const lastProductRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          //  setHasMore(page == pages ? false : true);
          let x = page + 1;
          dispatch(listProducts({ currentPage: x, keyword }));
          // dispatch(incPage());
        }
      });
      if (node) observer.current.observe(node);
      //console.log(node);
    },
    [isLoading, hasMore, page, dispatch, keyword]
  );
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
      {false ? (
        <Loader />
      ) : error ? (
        <Message varient="danger">{error}</Message>
      ) : (
        <Row>
          {homeProducts.map((product, index) =>
            homeProducts.length === index + 1 ? (
              <Col
                key={product._id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                ref={lastProductRef}>
                <Product product={product} />
              </Col>
            ) : (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            )
          )}
          {isLoading && <Loader />}
        </Row>
      )}
    </>
  );
}

export default HomeScreen;
