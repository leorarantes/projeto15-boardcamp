import { Router } from "express";

import { getAllRentals, addRental, finishRental, deleteRental } from "../controllers/rentalsController.js";
import { validateRental } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getAllRentals);
rentalsRouter.post("/rentals", validateRental, addRental);
rentalsRouter.post("/rentals/:id/return", finishRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter; 