// this the main Error class All other error classes will inherit fromthis class
export class AppError extends Error {
    msg:string;
  constructor(msg: string) {
    //what ever argument passed into msg should be in the json format so that it converted from string in to an object
    super(msg);
    this.msg=msg
  }
}




