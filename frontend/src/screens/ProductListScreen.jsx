import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  deleteProduct,
  createProduct,
  createProductReset,
  resetDelete,
  getProductsAdmin,
  hideProduct,
  unHideProduct,
  hideProductsReset,
  reset,
} from "../features/products/productSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const ProductListScreen = () => {
  const [searchParams] = useSearchParams({});
  //const [searchParams, setSearchParams] = useSearchParams({});
  const keyword = searchParams.get("keyword");
  const { pageNumber } = useParams() || 1; //get id from the paramaters of the url
  const [frontVis, setfrontVis] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    productListLoading: loading,
    productListError: error,
    // productsList: products, //PAGINATED
    products,
    page,
    pages,
    message,
    isSuccess,
    loadingCreate,
    errorCreate,
    successCreate,
    product: createdProduct,
    messageCreate,
    loadingDelete,
    errorDelete,
    successDelete,
    messageDelete,
    hideProductSuccess,
    hideProductsMessage,
    hideProductsError,
    hideProductLoading,
    isLoading,
  } = useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(hideProductsReset());
  // }, [dispatch, hideProductSuccess]);

  useEffect(() => {
    dispatch(createProductReset());
    dispatch(resetDelete());
    dispatch(hideProductsReset());

    if (!user || !user.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(getProductsAdmin(keyword));
      // dispatch(listProducts(pageNumber));
    }
  }, [
    dispatch,
    navigate,
    user,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
    keyword,
    hideProductSuccess,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
      // dispatch(getProducts()); //CHANGE PAGINATE
    }
  };

  const hideHandler = (product) => {
    if (product.visibility) {
      dispatch(hideProduct(product._id));
    } else {
      dispatch(unHideProduct(product._id));
    }

    //IMPORTANT HOW TO MUTATE VALUE IN ARRAY BEING RENDERED WITH STATES
    const index = products.findIndex((x) => x._id === product._id);
    let items = [...frontVis];
    let item = { ...items[index] };
    item = false; //item.name=x
    items[index] = item;
    setfrontVis(items);
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  useEffect(() => {
    dispatch(reset());
    let x = [];
    products.forEach((element) => {
      x.push(true);
    });

    setfrontVis(x);
  }, [isSuccess, dispatch]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
          {hideProductsError && <Message>{hideProductsMessage}</Message>}
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{messageDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{messageCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{message}</Message>
      ) : (
        <>
          <Table bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>Visibility</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product._id}
                  className={product.visibility ? "" : "table-dark"}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.visibility ? "Visible" : "Hidden"}</td>
                  <td>
                    <Button
                      variant="info"
                      className="btn-sm"
                      disabled={!frontVis[index]}
                      onClick={() => hideHandler(product)}>
                      {product.visibility ? (
                        <i className="fa-solid fa-eye"></i>
                      ) : (
                        <i className="fa-solid fa-eye-slash"></i>
                      )}
                    </Button>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <Paginate pages={pages} page={page} isAdmin={true} /> */}
        </>
      )}
    </>
  );
};

export default ProductListScreen;
