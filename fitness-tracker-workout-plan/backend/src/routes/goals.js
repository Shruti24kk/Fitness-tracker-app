import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { listGoals, createGoal, updateGoal, deleteGoal, goalCreateValidators } from "../controllers/goalController.js";

const router = Router();
router.use(authRequired);

router.get("/", listGoals);
router.post("/", goalCreateValidators, createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
