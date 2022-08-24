import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductsAdmin,
  getProductsPage,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/admin").get(protect, admin, getProductsAdmin);
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/page").get(getProductsPage);
router.route("/:id/reviews").post(protect, createProductReview);
router.get("/top", getTopProducts);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
