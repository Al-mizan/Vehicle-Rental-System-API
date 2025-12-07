import { Request, Response } from "express";
import { bookingService } from "./bookings.service.js";


const createBooking = async (req: Request, res: Response) => {
    try {
        // If user is customer, ensure they can only create bookings for themselves
        const userRole = req.user!.role as string;
        const userId = req.user!.id as string;
        
        if (userRole === "customer" && req.body.customer_id && req.body.customer_id.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only create bookings for yourself",
            });
        }
        
        // If customer doesn't provide customer_id, use their own ID
        if (userRole === "customer" && !req.body.customer_id) {
            req.body.customer_id = userId;
        }
        
        const result = await bookingService.createBooking(req.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const getBookings = async (req: Request, res: Response) => {
    try {
        const role = (req.user!.role) as string;
        const id = (req.user!.id) as string;
        const result = await bookingService.getBookings(role, id);

        if (result.length === 0) {
            res.status(200).json({
                success: true,
                message: role === "admin" ? "No bookings found" : "Your bookings not found",
                data: [],
            });
        } else {
            res.status(200).json({
                success: true,
                message: role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
                data: result,
            });
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const updateBooking = async (req: Request, res: Response) => {
    if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
            success: false,
            message: 'Request body is required',
        });
    }
    const { bookingId } = req.params;
    const { status } = req.body;
    
    if(status === "returned" && req.user!.role === "customer") {
        res.status(403).json({ 
            success: false,
            message: "You are not allowed" 
        });
        return;
    }
    try {
        const result = await bookingService.updateBooking(bookingId!, status, req.user!.id);

        if (result.length == 0) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: status as string === "cancelled" 
                    ? "Booking cancelled successfully" 
                    : "Booking marked as returned. Vehicle is now available",
                data: result[0],
            });
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}


export const bookingController = {
    createBooking,
    getBookings,
    updateBooking
}