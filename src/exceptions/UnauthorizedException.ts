import HttpException from './HttpException';

class UnauthorizedException extends HttpException {
  status: number;
  message: string;
  constructor(message: string, internalCode: string, info?: any) {
    super(401, message, internalCode);
    this.status = 401;
    this.message = message;
    this.info = info;
  }
}

export default UnauthorizedException;
