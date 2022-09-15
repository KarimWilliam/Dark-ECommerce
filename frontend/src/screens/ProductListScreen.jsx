import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
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
import SortFunction from "../components/SortFunction";

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
  } = useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);

  const [displayProducts, setDisplayProducts] = useState([]);
  const [sortDirectionName, setSortDirectionName] = useState(false);
  const [sortDirectionPrice, setSortDirectionPrice] = useState(false);
  const [sortDirectionID, setSortDirectionID] = useState(false);
  const [sortDirectionCategory, setSortDirectionCategory] = useState(false);
  const [sortDirectionBrand, setSortDirectionBrand] = useState(false);
  const [sortDirectionVisibility, setSortDirectionVisibility] = useState(false);

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

  useEffect(() => {
    if (isSuccess) {
      setDisplayProducts(products);
    }
    dispatch(reset());
  }, [isSuccess]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
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
    //remove products if break
  }, [isSuccess, dispatch, products]);

  const sortByName = () => {
    setSortDirectionName(!sortDirectionName);
    setDisplayProducts(
      SortFunction(displayProducts, sortDirectionName, "name")
    );
  };

  const sortByID = () => {
    setSortDirectionID(!sortDirectionID);
    setDisplayProducts(SortFunction(displayProducts, sortDirectionID, "_id"));
  };
  const sortByPrice = () => {
    setSortDirectionPrice(!sortDirectionPrice);
    setDisplayProducts(
      SortFunction(displayProducts, sortDirectionPrice, "price")
    );
  };
  const sortByCategory = () => {
    setSortDirectionCategory(!sortDirectionCategory);
    setDisplayProducts(
      SortFunction(displayProducts, sortDirectionCategory, "category")
    );
  };
  const sortByBrand = () => {
    setSortDirectionBrand(!sortDirectionBrand);
    setDisplayProducts(
      SortFunction(displayProducts, sortDirectionBrand, "brand")
    );
  };

  const sortByVisibility = () => {
    setSortDirectionVisibility(!sortDirectionVisibility);
    setDisplayProducts(
      SortFunction(displayProducts, sortDirectionVisibility, "visibility")
    );
  };

  return (
    <>
      <h1 className="main-color-in"> Products</h1>
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
          {hideProductsError && <Message>{hideProductsMessage}</Message>}

          <button
            style={{ margin: "20px" }}
            className="btn"
            onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </button>

          <div className="table-responsive ">
            <table className="table table-sm  table-hover table-bordered">
              <thead>
                <tr>
                  <th>
                    <button
                      className="btn"
                      style={{ flex: 1 }}
                      onClick={() => {
                        sortByID();
                      }}>
                      ID
                    </button>
                  </th>
                  <th>
                    {" "}
                    <button
                      className="btn"
                      style={{ flex: 1 }}
                      onClick={() => {
                        sortByName();
                      }}>
                      Name
                    </button>
                  </th>
                  <th>
                    <button
                      className="btn"
                      style={{ flex: 1 }}
                      onClick={() => {
                        sortByPrice();
                      }}>
                      Price
                    </button>
                  </th>
                  <th>
                    <button
                      className="btn"
                      style={{ flex: 1 }}
                      onClick={() => {
                        sortByCategory();
                      }}>
                      Category
                    </button>
                  </th>
                  <th>
                    <button
                      className="btn"
                      style={{ flex: 1 }}
                      onClick={() => {
                        sortByBrand();
                      }}>
                      Brand
                    </button>
                  </th>
                  <th>
                    <button
                      className="btn"
                      style={{ flex: 1 }}
                      onClick={() => {
                        sortByVisibility();
                      }}>
                      Visibility
                    </button>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className={product.visibility ? "" : "table-dark"}>
                    <td style={{ maxWidth: "200px" }}> {product._id}</td>
                    <td style={{ maxWidth: "200px" }}>{product.name}</td>
                    <td>${product.price}</td>
                    <td style={{ maxWidth: "200px" }}>{product.category}</td>
                    <td style={{ maxWidth: "200px" }}>{product.brand}</td>
                    <td>{product.visibility ? "Visible" : "Hidden"}</td>
                    <td>
                      <button
                        className="btn"
                        disabled={!frontVis[index]}
                        onClick={() => hideHandler(product)}>
                        {product.visibility ? (
                          <i className="fa-solid fa-eye"></i>
                        ) : (
                          <i className="fa-solid fa-eye-slash"></i>
                        )}
                      </button>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <button variant="light" className="btn">
                          <i className="fas fa-edit"></i>
                        </button>
                      </Link>
                      <button
                        variant="danger"
                        className="btn trashButton tooltiptrash"
                        onClick={() => deleteHandler(product._id)}>
                        <i className=" fas fa-trash ">
                          <div className="left">delete...</div>
                        </i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <Paginate pages={pages} page={page} isAdmin={true} /> */}
        </>
      )}
    </>
  );
};

export default ProductListScreen;
