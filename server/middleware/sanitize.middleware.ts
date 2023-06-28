import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult, ValidationError } from 'express-validator';

const paramsValidationRules = () => {
  return [param().toInt()];
}

const currenciesParamsValidationRules = () => {
  return [
    param('base').trim().escape(),
  ];
}

const voteParamsValidationRules = () => {
  return [
    param('projectId').toInt(),
    param('id').toInt(),
    param('direction').trim().escape(),
  ];
}

// do for all post routes!
const projectValidationRules = () => {
  return [
    // username must be an email
    body('username').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }),
  ];
}

// .optional()
// const sanitizePost = () => body('email').isEmail();
// check('name').isLength({ min: 3 }).trim().escape(),
// check('email').isEmail().normalizeEmail(),
// check('age').isNumeric().trim().escape()

function validate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const errors = validationResult(request)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors: ValidationError[] = []
  errors.array().map(err => extractedErrors.push(err))

  return response.status(422).json({
    errors: extractedErrors,
  })
}

export {
  paramsValidationRules,
  currenciesParamsValidationRules,
  voteParamsValidationRules,
  projectValidationRules,
  validate,
};
