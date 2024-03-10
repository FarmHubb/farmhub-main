import { validationResult } from "express-validator";

export const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({
            message: 'Error(s) during validaiton. Please check the fields and try again.',
            errors: errors.array()
        });
    next();
}