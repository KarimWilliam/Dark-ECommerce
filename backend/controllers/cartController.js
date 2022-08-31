import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// @desc add an item to the current user's cart
// @route POST /api/cart
// @access private
export const addItem = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const user = await User.findById(req.user.id);

  const existItem = user.cartItems.find(
    (x) => JSON.stringify(x.product) == JSON.stringify(product._id)
  );
  const qty = req.body.qty;
  if (product.visibility && !product.archived) {
    if (existItem) {
      //does not add onto the existing quantity. instead it replaces the quantity with the new quantity
      user.cartItems = user.cartItems.map((x) =>
        JSON.stringify(x.product) == JSON.stringify(existItem.product)
          ? { product: product._id, qty: Number(qty) }
          : x
      );
    } else {
      user.cartItems.push({ product: product._id, qty: Number(qty) });
    }
    await user.save();
    const user2 = await User.findById(req.user.id).populate(
      "cartItems.product",
      "name image price countInStock "
    );
    res.json(user2.cartItems);
    //res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//get all cart items
export const getItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate(
    "cartItems.product",
    "name image price countInStock archived visibility "
  );
  //remove removed items from user's cart
  let i = user.cartItems.length;
  while (i--) {
    if (
      user.cartItems[i].product.visibility != true ||
      user.cartItems[i].product.archived
    ) {
      user.cartItems.splice(i, 1);
    }
  }
  await user.save();
  res.json(user.cartItems);
});

//delete item from cart
export const deleteItem = asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.user.id },
    { $pull: { cartItems: { product: req.params.id } } }
  );
  res.json("ok");
});

//delete all items from cart
export const clearCart = asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { $pull: { cartItems: {} } });
  res.json("ok");
});

//Merge carts
export const mergeCarts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (req.body.tempCart) {
    const tempCartProducts = req.body.tempCart;
    //console.log(req.body);
    // console.log(tempCartProducts);
    let newCartItems = user.cartItems;
    let exist = false;
    let j = 0;
    for (let i = 0; i < tempCartProducts.length; i++) {
      for (j; j < user.cartItems.length; j++) {
        if (tempCartProducts[i].product._id == user.cartItems[j].product._id) {
          exist = true;
          break;
        }
      }
      if (!exist) {
        newCartItems.push({
          qty: Number(tempCartProducts[i].qty),
          product: tempCartProducts[i].product._id,
        });
      }
      exist = false;
      j = 0;
    }
    await User.updateOne({ _id: req.user.id }, { cartItems: newCartItems });
    const useritems = await User.findById(req.user.id).populate(
      "cartItems.product",
      "name image price countInStock "
    );
    res.json(useritems.cartItems);
  } else {
    const useritems = await User.findById(req.user.id).populate(
      "cartItems.product",
      "name image price countInStock "
    );

    res.json(useritems.cartItems);
  }
});
