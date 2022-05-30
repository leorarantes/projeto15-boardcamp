import joi from "joi";

export function validateRental(req, res, next) {
    const newRental = req.body;

    const rentalSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().greater(0)
    });

    const validation = rentalSchema.validate(newRental);
    if (validation.error) {
        res.sendStatus(400);
        return;
    }

    next();
}