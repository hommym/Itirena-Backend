"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const jwt_1 = require("../libs/jwt");
const AppError_1 = require("../components/AppError");
const verifyJwt = (req, res, next) => {
    let jwtData = null;
    console.log("Jwt verification began....");
    try {
        if (req.params.verfToken || req.params.resetToken) {
            const token = req.params.verfToken ? req.params.verfToken : req.params.resetToken;
            jwtData = (0, jwt_1.verifyToken)(token);
            console.log("Jwt token Verified");
            req.body.id = jwtData.userId;
            req.body.verfcode = jwtData.code;
        }
        else if (req.headers !== undefined && req.headers.authorization !== undefined) {
            if (!req.headers.authorization.startsWith("Bearer ")) {
                res.status(400);
                throw new Error(`{"errType":"Request Error" ,"message":" Bearer scheme not found"}`);
            }
            jwtData = (0, jwt_1.verifyToken)(req.headers.authorization.split(" ")[1]);
            if (!jwtData.userId) {
                res.status(409);
                throw new AppError_1.AppError(`{"errType":"Auth Error" ,"message":"Invalid Token"}`);
            }
            console.log("Jwt token Verified");
            req.body.id = jwtData.userId;
        }
        else {
            res.status(400);
            throw new AppError_1.AppError(`{"errType":"Request Error" ,"message":"Authorization Header not defined"}`);
        }
        next();
    }
    catch (error) {
        res.status(401);
        next(error);
    }
};
exports.verifyJwt = verifyJwt;
