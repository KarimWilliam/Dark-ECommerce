import express from "express";
const router = express.Router();
import {
  addItem,
  getItems,
  deleteItem,
  mergeCarts,
} from "../controllers/cartController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/:id").post(protect, addItem).delete(protect, deleteItem);
router.route("/").get(protect, getItems).post(protect, mergeCarts);

export default router;
