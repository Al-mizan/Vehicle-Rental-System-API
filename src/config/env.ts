import { config } from "dotenv";

config({ path: ".env" });

export const {
    PORT,
    CONNECTION_STRING,
    JWT_SECRET,
} = process.env;