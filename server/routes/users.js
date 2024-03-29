import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriends,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();


/*READ */
router.get("/getUser",getUser);
router.get("/:id/friends",verifyToken,getUserFriends);

/*UPDATE */
router.patch("/:id/:friendsId",verifyToken,addRemoveFriends);


export default router;