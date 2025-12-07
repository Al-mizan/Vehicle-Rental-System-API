import { Router } from "express";
import logger from "../../middleware/logger.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../constants/roles.js";
import { bookingController } from "./bookings.controller.js";


const bookingRoute = Router();

bookingRoute.post('/', logger, auth(UserRole.ADMIN, UserRole.CUSTOMER), bookingController.createBooking);

bookingRoute.get('/', logger, auth(UserRole.ADMIN, UserRole.CUSTOMER), bookingController.getBookings);

bookingRoute.put('/:bookingId', logger, auth(UserRole.ADMIN, UserRole.CUSTOMER), bookingController.updateBooking)

export default bookingRoute;