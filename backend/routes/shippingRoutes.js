import express from "express";
const router = express.Router();
import {
  createAddress,
  editAddress,
  getDefaultAddress,
  getAllAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/shippingController.js";
import { protect } from "../middleware/authMiddleware.js";

//api/shipping
router.route("/").post(protect, createAddress).get(protect, getDefaultAddress);
router
  .route("/:id")
  .post(protect, editAddress)
  .delete(protect, deleteAddress)
  .put(protect, setDefaultAddress);
router.route("/all").get(protect, getAllAddress);
export default router;
