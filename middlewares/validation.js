const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateLogin = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];

const validateRegister = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date Of Birth cannot be empty')
    .custom((value) => {
      const birthDate = new Date(value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age <= 12) {
        throw new Error('Age must be above 12 years');
      }
      return true;
    }),
  handleValidationErrors,
];

const validateProductCreation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a valid number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  body('CategoryId').isInt().withMessage('CategoryId must be a valid integer'),
  handleValidationErrors,
];

const validateProductId = [
  param('id').isInt().withMessage('Product ID must be a valid integer'),
  handleValidationErrors,
];

// Validation for Balance Top-Up
const validateBalanceTopUp = [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  handleValidationErrors,
];

// Validation for Order
const validateOrderCreation = [
  param('id').isInt().withMessage('Product ID must be a valid integer'),
  handleValidationErrors,
];

// Validation for Filters/Search
const validateProductFilter = [
  query('category').optional().isInt().withMessage('Category ID must be a valid integer'),
  query('search').optional().isString().withMessage('Search query must be a string'),
  handleValidationErrors,
];

module.exports = {
  validateLogin,
  validateRegister,
  validateProductCreation,
  validateProductId,
  validateBalanceTopUp,
  validateOrderCreation,
  validateProductFilter,
};


