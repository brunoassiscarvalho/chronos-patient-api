import { logger } from "../logger/winston";
import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  logger.error(error);
  const status = error.status || 500;
  const message = error.message || "Algo deu errado";
  // const info = error.info;
  response.status(status).send({ ...error, message });
}

export default errorMiddleware;
