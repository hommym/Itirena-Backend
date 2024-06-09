// importing required modules
import mongoose, { Types } from "mongoose";
// const mongoose = require("mongoose");

mongoose.connection.once("open", (): void => {
  console.log("Database connection successfully established");
});

mongoose.connection.on("error", (e): void => {
  console.log(`An error occurred while connecting ${e.message}`);
});

export const connectToDatabase = async (connectionUrl: string | undefined): Promise<void> => {
  if (typeof connectionUrl === "string") {
    await mongoose.connect(connectionUrl);
  } else {
    console.log("Mongo Db connection url undefined");
  }
};

export const tObjectId = (id: string): Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};

// exports = { connectToDatabase, tObjectId };
