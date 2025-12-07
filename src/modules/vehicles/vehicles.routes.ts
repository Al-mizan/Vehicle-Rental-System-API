import { Router } from "express";
import logger from "../../middleware/logger.js";
import auth from "../../middleware/auth.js";
import { AuthPermission } from "../../constants/roles.js";
import { vehiclesController } from "./vehicles.controller.js";


const vehicleRoute = Router();

vehicleRoute.post('/', logger, auth(AuthPermission.ADMIN), vehiclesController.createVehicle);

vehicleRoute.get('/', logger, vehiclesController.getVehicles);

vehicleRoute.get('/:vehicleId', logger, vehiclesController.getSingleVehicle);

vehicleRoute.put('/:vehicleId', logger, auth(AuthPermission.ADMIN), vehiclesController.updateVehicle);

vehicleRoute.delete('/:vehicleId', logger, auth(AuthPermission.ADMIN), vehiclesController.deleteVehicle);


export default vehicleRoute;