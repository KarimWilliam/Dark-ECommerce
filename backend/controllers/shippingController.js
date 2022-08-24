import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { Address } from "../models/userModel.js";

// @desc create a new address for the user
// @route POST /api/shipping/
// @access private
export const createAddress = asyncHandler(async (req, res) => {
  const defaulty = false;
  const user = await User.findById(req.user.id);
  if (user.addressList.length === 0) {
    defaulty = true;
  }
  const { name, address, city, postalCode, country, phoneNumber } = req.body;

  if (!name || !address || !city || !postalCode || !country || !phoneNumber) {
    res.status(400);
    throw new Error("Please fill out all of the fields");
  }

  const newAddress = new Address({
    name: name,
    address: address,
    city: city,
    postalCode: postalCode,
    country: country,
    phoneNumber: phoneNumber,
    default: defaulty,
  });

  user.addressList.push(newAddress);

  await user.save();
  res.status(200).json(user.addressList);
});

// @desc Get all user address
// @route Get /api/shipping/all
// @access private
export const getAllAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user.addressList);
});

// @desc edit a user address
// @route POST /api/shipping/:id
// @access private
export const editAddress = asyncHandler(async (req, res) => {
  const { name, address, city, postalCode, country, phoneNumber } = req.body;

  console.log(req.body);
  if (!name || !address || !city || !postalCode || !country || !phoneNumber) {
    res.status(400);
    throw new Error("Please fill out all of the fields");
  }

  const updatedAddress = await User.findOneAndUpdate(
    { _id: req.user.id, "addressList._id": req.params.id },
    {
      $set: {
        "addressList.$.name": name,
        "addressList.$.address": address,
        "addressList.$.city": city,
        "addressList.$.postalCode": postalCode,
        "addressList.$.phoneNumber": phoneNumber,
        "addressList.$.country": country,
      },
    }
  );
  //await user.save();
  const user = await User.findById(req.user.id);
  res.status(200).json(user.addressList);
});

// @desc set a new defualt address for the user
// @route PUT /api/shipping/:id
// @access private
export const setDefaultAddress = asyncHandler(async (req, res) => {
  //can be better probably
  const user = await User.findById(req.user.id);
  user.addressList.forEach((element) => {
    element.default = false;
  });
  await user.save();
  const updatedAddress = await User.findOneAndUpdate(
    { _id: req.user.id, "addressList._id": req.params.id },
    {
      $set: {
        "addressList.$.default": true,
      },
    }
  );
  let address = "";
  user.addressList.forEach((element) => {
    if (element.default === true) {
      address = element;
    }
  });
  if (address) {
    res.json(address);
  } else {
    res.status(400);
    throw new Error("no Default found");
  }
});

// @desc get the user default Address
// @route Get /api/shipping/
// @access private
export const getDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  let address = "";
  user.addressList.forEach((element) => {
    if (element.default === true) {
      address = element;
    }
  });
  if (address) {
    res.json(address);
  } else {
    res.status(400);
    throw new Error("no Default found");
  }
});

// @desc create a new address for the user
// @route Delete /api/shipping/:id
// @access private
export const deleteAddress = asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.user.id },
    { $pull: { addressList: { _id: req.params.id } } }
  );
  res.json("deleted Successfully");
});
