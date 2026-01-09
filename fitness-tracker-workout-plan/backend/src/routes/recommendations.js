import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { recommend } from "../controllers/recommendationController.js";

const router = Router();
router.use(authRequired);

router.post("/", recommend);

export default router;
