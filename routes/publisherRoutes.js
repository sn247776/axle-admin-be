import express from "express";
import { loginPublisher, logoutPublisher, registerPublisher } from "../controllers/publisherController.js";
import singleUpload from "../middlewares/multer.js";


const router = express.Router();

router.route("/register").post(singleUpload, registerPublisher);
router.route("/login").post(loginPublisher);
router.route("/logout").get(logoutPublisher);

export default router;