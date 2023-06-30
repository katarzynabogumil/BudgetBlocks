import { NextFunction, Request, Response } from 'express';
import { body, param, check, validationResult, ValidationError } from 'express-validator';

const paramsValidationRules = () => {
  return [
    check('id').optional({ nullable: true }).toInt(),
    check('projectId').optional({ nullable: true }).toInt(),
    check('commentId').optional({ nullable: true }).toInt(),
  ];
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

const userValidationRules = () => {
  return [
    body('sub').trim().escape(),
    body('firstName').trim().escape(),
    body('lastName').optional({ nullable: true }).trim().escape(),
    body('nickname').optional({ nullable: true }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
  ];
}

const commentValidationRules = () => {
  return [
    param('expenseId').toInt(),
    body('text').trim().escape(),
  ];
}

const addUserValidationRules = () => {
  return [
    param('projectId').toInt(),
    body('email').isEmail().normalizeEmail(),
  ];
}

const projectValidationRules = () => {
  return [
    param('id').optional().toInt(),
    body('name').trim().escape(),
    body('type').trim().escape(),
    body('budget').toFloat(),
    body('budgetRating').optional({ nullable: true }).toInt(),
    body('currency').trim().escape(),
    body('dateFrom').optional({ nullable: true }).isISO8601().toDate(),
    body('dateTo').optional({ nullable: true }).isISO8601().toDate(),
    body('area').optional({ nullable: true }).toInt(),
    body('location').optional({ nullable: true }).trim().escape(),
    body('noOfGuests').optional({ nullable: true }).toInt(),
    body('occasion').optional({ nullable: true }).trim().escape(),
    body('origin').optional({ nullable: true }).trim().escape(),
    body('destination').optional({ nullable: true }).trim().escape(),
    body('description').optional({ nullable: true }).trim().escape(),

    body('currencyRates').optional({ nullable: true }),
    check('currencyRates.success')
      .if(body('currencyRates').exists()).optional({ nullable: true }).isBoolean(),
    check('currencyRates.backup')
      .if(body('currencyRates').exists()).optional({ nullable: true }).isBoolean(),
    check('currencyRates.timestamp')
      .if(body('currencyRates').exists()).optional({ nullable: true }).toInt(),
    check('currencyRates.base')
      .if(body('currencyRates').exists()).optional({ nullable: true }).trim().escape(),
    check('currencyRates.date')
      .if(body('currencyRates').exists()).optional({ nullable: true }).trim().escape(),
    check('currencyRates.rates.**')
      .if(body('currencyRates').exists()).optional({ nullable: true }).toFloat(),

    check('currencyRates.error').optional({ nullable: true }),
    check('currencyRates.error.code').optional({ nullable: true })
      .if(body('currencyRates.error').exists()).isNumeric().trim().escape(),
    check('currencyRates.error.type').optional({ nullable: true })
      .if(body('currencyRates.error').exists()).trim().escape(),
    check('currencyRates.error.info').optional({ nullable: true })
      .if(body('currencyRates.error').exists()).trim().escape(),
  ];
}

const expenseValidationRules = () => {
  return [
    param('id').optional().toInt(),
    param('projectId').optional({ nullable: true }).toInt(),
    body('name').trim().escape(),
    body('cost').toFloat(),
    body('calcCost').optional({ nullable: true }).toFloat(),
    body('currency').trim().escape(),
    body('link').optional({ nullable: true }).isURL({ protocols: ['https'] }),
    body('photo').optional({ nullable: true }).isURL({ protocols: ['https'] }),
    body('notes').optional({ nullable: true }).trim().escape(),

    check('category.category').trim().escape(),
    check('category.orderId').toInt(),
    check('category.optional').optional({ nullable: true }).isBoolean(),
  ];
}

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
  console.log(extractedErrors);

  return response.status(422).json({
    errors: extractedErrors,
  })
}

export {
  paramsValidationRules,
  currenciesParamsValidationRules,
  voteParamsValidationRules,
  userValidationRules,
  addUserValidationRules,
  projectValidationRules,
  expenseValidationRules,
  commentValidationRules,
  validate,
};