import { Router } from "express";

import { getAllCustomers, getCustomer, addCustomer, updateCustomer } from "../controllers/customersController.js";
import { validateCustomer } from "../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getAllCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", validateCustomer, addCustomer);
customersRouter.put("/customers/:id", validateCustomer, updateCustomer);

export default customersRouter;