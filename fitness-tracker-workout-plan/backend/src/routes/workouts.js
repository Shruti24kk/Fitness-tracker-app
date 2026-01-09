import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { listWorkouts, createWorkout, updateWorkout, deleteWorkout, workoutCreateValidators } from "../controllers/workoutController.js";

const router = Router();
router.use(authRequired);

router.get("/", listWorkouts);
router.post("/", workoutCreateValidators, createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
