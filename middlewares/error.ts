import { Request, Response, NextFunction } from "express";
import { BaseError } from "./baseErrors";

// Interface for legacy error compatibility
interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

// Not Found Middleware
const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  (error as CustomError).statusCode = 404;
  next(error);
};

// Error Handler Middleware (properly typed)
const errorHandler = (
  err: CustomError | BaseError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Determine status code
  const statusCode = 
    err instanceof BaseError ? err.statusCode : 
    err.statusCode || err.status || 500;

  // Prepare response object
  const response: {
    message: string;
    stack?: string;
  } = {
    message: err.message || 'حدث خطأ قي السيرفر'
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Send response
  res.status(statusCode).json(response);
};

export { notFound, errorHandler };