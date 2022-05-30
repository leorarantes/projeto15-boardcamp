import { Router } from "express";

import { addCategory, getAllCategories } from "../controllers/categoriesController.js";
import { validateCategory } from "../middlewares/categoriesMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getAllCategories);
categoriesRouter.post("/categories", validateCategory, addCategory);

export default categoriesRouter;