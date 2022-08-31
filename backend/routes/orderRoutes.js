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
  paypalPayOrder,
  updateOrderToPaidPaypal,
  finalizeOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/stripe/:id").get(protect, stripePayOrder);
router
  .route("/paypal/:id")
  .get(protect, paypalPayOrder)
  .post(protect, updateOrderToPaidPaypal);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id/finalize").get(protect, finalizeOrder);
router.route("/:id").get(protect, getOrderById);

export default router;
