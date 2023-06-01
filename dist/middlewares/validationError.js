"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class ValidationErrorMiddleware {
    //422 Unprocessable Entity
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
    static handleErrors(req, res, next) {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        return next();
    }
}
exports.default = ValidationErrorMiddleware;
