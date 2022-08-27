import express from "express";
const router = express.Router();
import {
  createAddress,
  editAddress,
  getDefaultAddress,
  getAllAddress,
  deleteAddress,
  setDefaultAddress,
  getAddress,
} from "../controllers/shippingController.js";
import { protect } from "../middleware/authMiddleware.js";

//api/shipping
router.route("/").post(protect, createAddress).get(protect, getDefaultAddress);
router.route("/all").get(protect, getAllAddress);
router
  .route("/:id")
  .post(protect, editAddress)
  .delete(protect, deleteAddress)
  .put(protect, setDefaultAddress)
  .get(protect, getAddress);
export default router;
