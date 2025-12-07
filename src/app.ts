import express, { Request, Response } from "express";

import { initDB } from "./config/db.js";
import userRoute from "./modules/users/users.routes.js";
import authRoute from "./modules/auth/auth.routes.js";
import vehicleRoute from "./modules/vehicles/vehicles.routes.js";
import bookingRoute from "./modules/bookings/bookings.routes.js";

export const app = express();

// Initialize db
await initDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json("WOW, my app, Vehicle Rental System API, is running!");
});

// all auth routes
app.use('/api/v1/auth', authRoute);

// all user routes
app.use('/api/v1/users', userRoute);

// all vehicle routes
app.use('/api/v1/vehicles', vehicleRoute);

// all booking routes
app.use('/api/v1/bookings', bookingRoute)

// if there is no matching route
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route is not found",
        path: req.path
    });
});
