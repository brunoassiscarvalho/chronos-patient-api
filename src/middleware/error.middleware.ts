import { logger } from '../logger/winston';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const status = error.status || 500;
  const message = error.message || 'Algo deu errado';
  logger.error({ ...error, message });
  response.status(status).send({ ...error, message });
}

export default errorMiddleware;
