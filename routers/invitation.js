import { Router } from "express";
import { getAllIinvitation,getinvitationsByUserId,completeInvitation,addInvitation,delInvitation} from "../controllers/invitation.js";

const router = Router();
router.get("/", getAllIinvitation)
router.get("/byUserId/:userid", getinvitationsByUserId)
router.post("/", addInvitation)
router.delete("/invitations/:Id", delInvitation);
router.put("/invitations/:id/complete", completeInvitation);

export default router;