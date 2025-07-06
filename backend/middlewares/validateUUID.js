import { validate as uuidValidate } from 'uuid';

export const validateUUID = (paramName) => (req, res, next) => {
  const paramValue = req.params[paramName];
  if (!paramValue || !uuidValidate(paramValue)) {
    return res.status(400).json({ message: `Invalid ${paramName}. Must be a valid UUID.` });
  }
  next();
};