import express from "express";
import { createGame, deleteGame, getAllGames, getGame } from "../controllers/gameController.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/games").get(getAllGames);
router.route("/games").post(singleUpload,createGame);

router.route("/game/:id") .delete( deleteGame).get(getGame);


export default router;