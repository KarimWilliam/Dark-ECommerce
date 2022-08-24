import React, { useEffect } from "react";
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
} from "../features/products/productSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const ProductListScreen = () => {
  const [searchParams] = useSearchParams({});
  //const [searchParams, setSearchParams] = useSearchParams({});
  const keyword = searchParams.get("keyword");
  const { pageNumber } = useParams() || 1; //get id from the paramaters of the url

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
    loadingCreate,
    errorCreate,
    successCreate,
    product: createdProduct,
    messageCreate,
    loadingDelete,
    errorDelete,
    successDelete,
    messageDelete,
  } = useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(createProductReset());
    dispatch(resetDelete());

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
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
      // dispatch(getProducts()); //CHANGE PAGINATE
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
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
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
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
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
