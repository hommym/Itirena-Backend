import dotenv from "dotenv";
dotenv.config();

// this component for logging stuff on the screen

//the flag component is for setting the level of importance of the log if is set to imp the message will be logged even if logger is turned off in env
export const loger = (msg: string|object) => {
  if (process.env.loggerSwitch === "On") {
    console.log(msg);
  }
};
