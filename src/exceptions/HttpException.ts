class HttpException extends Error {
  status: number;
  message: string;
  info: any;
  internalCode: string;
  constructor(
    status: number,
    message: string,
    internalCode: string,
    info?: any
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.internalCode = internalCode;
    this.info = info;
  }
}

export default HttpException;
