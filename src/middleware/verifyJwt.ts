// Custom data types
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../libs/jwt";

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  let jwtData = null;
  console.log("Jwt verification began....");
  try {
    if (req.params.verfToken || req.params.resetToken) {
      const token = req.params.verfToken ? req.params.verfToken : req.params.resetToken;
      jwtData = verifyToken(token);
      console.log("Jwt token Verified");
      req.body.id = jwtData.userId;
      req.body.verfcode = jwtData.code;
    } else if (req.headers !== undefined && req.headers.authorization !== undefined) {
      if (!req.headers.authorization.startsWith("Bearer ")) {
        res.status(400)
        throw new Error("Bad Request Bearer scheme not found");
      }

      jwtData = verifyToken(req.headers.authorization.split(" ")[1]);
      if(!jwtData.userId){
         res.status(409);
         throw new Error("Invalid jwt");
      }
      console.log("Jwt token Verified");
      req.body.id = jwtData.userId;
    } else {
      throw new Error("Bad Request Authorization Header not defined");
    }

    next();
  } catch (error) {
    next(error);
  }
};
