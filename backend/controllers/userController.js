import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Register a new user
// @route POST /api/users
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill out all of the fields");
  }
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access private
export const getUserProfile = asyncHandler(async (req, res) => {
  console.log(user);
  const user = await User.findById(req.user._id);

  if (user) {
    console.log(user.name);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    console.log("user not found");
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    send forgot password link to user email
// @route   post  /api/users/forgotPassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  if (!req.body.email) {
    res.status(404).json({ message: "Please enter a proper email" });
    throw new Error("Email not found");
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    //generate the OT link

    const secret = process.env.JWT_SECRET + user.password;
    console.log(secret);
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "15m",
    });
    const link = process.env.RESET_URL + `${user._id}/${token}`;
    console.log("link: " + link);
    //Send the OT link in an email
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "karim.william7@gmail.com", // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "karim.william7@gmail.com", // sender address
      to: req.body.email, // list of receivers
      subject: "Dark-Commerce Password Reset", // Subject line
      text: `Link is valid for 15 minutes and one use only. Link: ${link}`, // plain text body
    });

    res.send("password reset link has been sent to your email");
  } else {
    res.status(404).json({ message: "Email not found" });
    throw new Error("Email not found");
  }
});

// @desc    reset the user password to his desginated new password
// @route   post  /api/users/resetPassword/:id/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const newPassword = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const user = await User.findById(id);
  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    user.password = hashedPassword;
    await user.save();
    res.json("password Changed successfully");
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error("Invalid reset Link");
  }
});
