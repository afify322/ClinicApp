const { body, validationResult } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'addtest': {
      return [
        body('name', 'userName doesn\'t exists').exists(),
        body('date', 'doesn\'t exists').exists(),
        body('dose', 'doesn\'t exists').exists(),
        body('id', 'doesn\'t exists').exists(),
      ];
    }
  }
};
exports.checkValidationResult = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  next(result);
};
