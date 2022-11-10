import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import matchSorter from "match-sorter";

// @desc    Fetch 20 products based on search term
// @route   GET /api/products
// @access  Public
const getProductsPage = asyncHandler(async (req, res) => {
  // const list = ["hi", "hey", "hello", "sup", "yo"];
  // console.log(matchSorter.matchSorter(list, "h"));

  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const currentDate = req.query.currentDate;
  console.log(currentDate);
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  // const count = await Product.countDocuments({
  //   //...keyword,
  //   visibility: true,
  //   archived: false,
  //   createdAt: { $lt: currentDate },
  // });
  let products = await Product.find({
    // ...keyword,
    visibility: true,
    archived: false,
    // createdAt: { $lt: currentDate },    IMPORTANT: Problem with server parsing this date for mongoose.
  }).lean();
  //  .limit(pageSize)
  //  .skip(pageSize * (page - 1));
  let newlist = matchSorter.matchSorter(products, req.query.keyword, {
    keys: ["name", "brand", "desciption"],
  });

  let end = pageSize * (page - 1) + pageSize;

  if (end > newlist.length) {
    end = newlist.length;
  }

  products = newlist.slice(pageSize * (page - 1), end);
  res.json({ products, page, pages: Math.ceil(newlist.length / pageSize) });
});

// @desc Fetch all products
// @route Get /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const products = await Product.find({
    visibility: true,
    ...keyword,
    archived: false,
  });
  const adminproducts = await Product.find({});

  res.json(products);
});

// @desc Fetch all producnts
// @route Get /api/products
// @access Public
export const getProductsAdmin = asyncHandler(async (req, res) => {
  // const keyword = req.query.keyword
  //   ? {
  //       name: {
  //         $regex: req.query.keyword,
  //         $options: "i",
  //       },
  //     }
  //   : {};

  const user = await User.findById(req.user.id);
  //const products = await Product.find({ ...keyword, archived: false });
  let products = await Product.find({ archived: false }).lean();
  if (req.query.keyword) {
    products = matchSorter.matchSorter(products, req.query.keyword, {
      keys: ["name", "category", "brand"],
    });
  }

  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  // if (product) {
  //   await product.remove();
  //   res.json({ message: "Product removed" });
  // } else {
  //   res.status(404);
  //   throw new Error("Product not found");
  // }
  if (product) {
    product.archived = true;
    product.visibility = false;
    await product.save();
    res.json({ message: "Product Hidden" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Hide a product
// @route   Post /api/products/:id
// @access  Private/Admin
const hideProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log("commencing product hiding");
  if (product) {
    product.visibility = false;
    await product.save();
    res.json({ message: "Product Hidden" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Hide a product
// @route   Post /api/products/hide/:id
// @access  Private/Admin
const unHideProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.visibility = true;
    await product.save();
    res.json({ message: "Product Visible" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
    visibility: false,
    archived: false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.visibility = true;
    product.archived = false;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const user = await User.findById(req.user.id);
  const product = await Product.findById(req.params.id);
  const userOrders = await Order.findOne({
    user: req.user._id,
    "orderItems.product": req.params.id,
  });

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (!user.isAdmin) {
      if (!userOrders) {
        res.status(400);
        throw new Error("You must purchase an item before you review!");
      }
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ visiblity: true, archived: false })
    .sort({ rating: -1 })
    .limit(5);

  res.json(products);
});

export {
  getProductsPage,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  hideProduct,
  unHideProduct,
};
