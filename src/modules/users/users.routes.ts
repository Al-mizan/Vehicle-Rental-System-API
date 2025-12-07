import { Router } from "express";
import logger from "../../middleware/logger.js";
import { userController } from "./users.controller.js";
import auth from "../../middleware/auth.js";
import { AuthPermission } from "../../constants/roles.js";


const userRoute = Router();

userRoute.get('/', logger, auth(AuthPermission.ADMIN), userController.getUsers);
userRoute.put('/:userId', logger, auth(AuthPermission.ADMIN, AuthPermission.SELF), userController.updateUser);
userRoute.delete('/:userId', logger, auth(AuthPermission.ADMIN), userController.deleteUser);

export default userRoute;