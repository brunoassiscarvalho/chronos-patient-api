import HttpException from "./HttpException";

class BusinessException extends HttpException {
  status: number;
  message: string;
  info: any;
  constructor(message: string, internalCode: string, info?: any) {
    super(400, message, internalCode, info);
    this.status = 400;
    this.internalCode = internalCode;
    this.message = message;
    this.info = info;
  }
}

export default BusinessException;
