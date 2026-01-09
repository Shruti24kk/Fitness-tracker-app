import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { summary } from "../controllers/progressController.js";

const router = Router();
router.use(authRequired);

router.get("/summary", summary);

export default router;
