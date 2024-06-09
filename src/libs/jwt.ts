import jwt, { JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtForLogIn = (id: string): string | null => {
  if (process.env.JwtSecretKey !== undefined) {
    return jwt.sign({ userId: id }, process.env.JwtSecretKey, { expiresIn: "1d" });
  } else {
    return null;
  }
};

export const jwtForSignUp = (id: string, verfCode: number): string | null => {
  if (process.env.JwtSecretKey !== undefined) {
    return jwt.sign({ userId: id, code: verfCode }, process.env.JwtSecretKey, { expiresIn: "1hr" });
  } else {
    return null;
  }
};

export const verifyToken = (token: string): JwtPayload | null | string | any => {
  try {
    if (process.env.JwtSecretKey !== undefined) {
      return jwt.verify(token, process.env.JwtSecretKey);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
