import { Request, Response, NextFunction } from 'express';
import Authorize from '../api/auth/authorize';
import HttpException from '../exceptions/HttpException';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any | HttpException> => {
  const authorize = new Authorize();
  authorize
    .verifyAuthentication(req, res)
    .then(() => {
      next();
    })
    .catch((e: HttpException) =>
      next(new HttpException(401, e.message, e.internalCode, e.info)),
    );
};
