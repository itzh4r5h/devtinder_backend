import mongoose from "mongoose";

const isProduction = process.env.NODE_ENV === 'prod'

export const connectDB = async () => {
  await mongoose.connect(isProduction ? process.env.DB_CONNECTION_STRING_PROD : process.env.DB_CONNECTION_STRING_DEV)
  console.log("connected to db")
}
