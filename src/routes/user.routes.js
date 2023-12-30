import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  takeOrder,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addingProduct,
  getProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.route("/register").post(registerUser);



// secure route
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/takeOrder").post(verifyJWT,takeOrder);

// adding product
router
  .route("/addingProduct")
  .post(upload.single("product_img"), addingProduct);
router.route("/getProducts").get(getProducts);

export default router;
