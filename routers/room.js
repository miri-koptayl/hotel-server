import { Router } from "express";
import { add, deleteByID, getAllRooms, getByID, updateByID } from "../controllers/room.js";

const router = Router();
router.get("/", getAllRooms)
router.get("/:id", getByID)
router.delete("/:id", deleteByID)
router.put("/:id", updateByID)
router.post("/", add)

export default router;