import { validationResult } from "express-validator";

// Middleware function to check validation errors
export const checkValidation = (req, res, next) => {
    // Get the validation errors from the request
    const errors = validationResult(req);

    // If there are validation errors
    if (!errors.isEmpty()) {
        // Return a response with status 400 (Bad Request) and error details
        return res.status(400).json({
            message: 'Error(s) during validation. Please check the fields and try again.',
            errors: errors.array()
        });
    }

    // If there are no validation errors, proceed to the next middleware
    next();
}