import joi from "joi";

export function validateGame(req, res, next) {
    const newGame = req.body;

    const gameSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().required(),
        stockTotal: joi.number().greater(0),
        categoryId: joi.number().required(),
        pricePerDay: joi.number().greater(0)
    });

    const validation = gameSchema.validate(newGame);
    if (validation.error) {
        res.sendStatus(400);
        return;
    }

    next();
}