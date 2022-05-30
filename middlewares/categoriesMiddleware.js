import joi from "joi";

export function validateCategory(req, res, next) {
    const newCategory = req.body;

    const categorySchema = joi.object({
        name: joi.string().required()
    });

    const validation = categorySchema.validate(newCategory);
    if (validation.error) {
        res.sendStatus(400);
        return;
    }

    next();
}