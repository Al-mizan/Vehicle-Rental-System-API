import { Router } from "express";
import { authController } from "./auth.controller.js";


const authRoute = Router();

// signup route
authRoute.post('/signup', authController.signUp);

// signin route
authRoute.post('/signin', authController.signIn);


export default authRoute;