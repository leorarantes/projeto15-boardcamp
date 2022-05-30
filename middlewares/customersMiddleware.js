import joi from "joi";

export function validateCustomer(req, res, next) {
    const newCustomer = req.body;

    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().pattern(/[0-9]{10,11}/),
        cpf: joi.string().pattern(/[0-9]{11}/),
        birthday: joi.string().pattern(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/)
    });

    
    const validation = customerSchema.validate(newCustomer);

    if (validation.error) {
        res.sendStatus(400);
        return;
    }

    const year = parseInt(newCustomer.birthday.slice(0, 4));
    const month = parseInt(newCustomer.birthday.slice(5, 7));
    const day = parseInt(newCustomer.birthday.slice(8));

    if(year < 1900 || year > 2022 || month > 12 || day > 31) {
        res.sendStatus(400);
        return;
    }

    next();
}