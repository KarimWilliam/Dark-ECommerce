import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  stripePayOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/stripe/:id").get(protect, stripePayOrder);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id").get(protect, getOrderById);

export default router;
