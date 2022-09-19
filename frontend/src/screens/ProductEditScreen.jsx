import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  updateProduct,
  resetUpdate,
} from "../features/products/productSlice";

const ProductEditScreen = () => {
  const { id: productId } = useParams(); //get id from the paramaters of the url

  // eslint-disable-next-line
  const [imgFile, setImgFile] = useState("");
  // eslint-disable-next-line
  const [imgFileName, setImgFileName] = useState("choose File");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    product,
    message,
    loadingUpdate,
    errorUpdate,
    successUpdate,
    messageUpdate,
  } = useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);

  // On file select (from the pop up)
  const onFileChange = async (event) => {
    // Update the state
    setImgFile(event.target.files[0]);
    setImgFileName(event.target.files[0].name);
    /////////////////////////
    const file = event.target.files[0];
    let formdata = new FormData();
    formdata.append("image", file);
    setUploading(true);

    //upload the multifile to the backend
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/upload", formdata, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (successUpdate) {
      dispatch(resetUpdate());
      navigate("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(getProduct(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate]);

  // const uploadFileHandler = async (e) => {
  //   const file = imgFile;
  //   let formData = new FormData();
  //   formData.append("image", file);
  //   setUploading(true);

  //   //upload the multifile to the backend
  //   try {
  //     const config = {
  //       onUploadProgress: (progressEvent) => {
  //         var percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / progressEvent.total
  //         );
  //         console.log(percentCompleted);
  //       },
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };

  //     const { data } = await axios.post("/api/upload", formData, config);
  //     setImage(data);
  //     setUploading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setUploading(false);
  //   }
  // };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3 ">
        Go Back
      </Link>
      <div className="form-container">
        <h1 className="main-color-in">Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{messageUpdate}</Message>}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{message}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="form-floating mb-3">
              <input
                style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                id="nameInput"
                className="form-control"
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}></input>
              <label htmlfor="nameInput">Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                id="price-input"
                className="form-control"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}></input>
              <label htmlfor="priceInput">Price</label>
            </div>
            <label htmlFor="text">Image</label>

            <input
              className="form-control"
              type="file"
              name="Image"
              id="customFile"
              encType="multipart/form-data"
              onChange={onFileChange}
            />
            <br></br>
            {uploading && (
              <span role="status" className="spinner-border"></span>
            )}

            <div className="form-floating mb-3">
              <input
                style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                id="brand-input"
                className="form-control"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}></input>
              <label htmlfor="brand-input">Brand</label>
            </div>
            <div className="form-floating mb-3">
              <input
                style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                id="stock-input"
                className="form-control"
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}></input>
              <label htmlfor="count-input">Count In Stock</label>
            </div>
            <div className="form-floating mb-3">
              <input
                style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                id="category-input"
                className="form-control"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}></input>
              <label htmlfor="category-input">Category</label>
            </div>
            <div className="form-floating mb-3">
              <input
                style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
                id="description-input"
                className="form-control"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></input>
              <label htmlfor="description-input">Description</label>
            </div>
            <button className="button-1" type="submit">
              Update
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ProductEditScreen;
