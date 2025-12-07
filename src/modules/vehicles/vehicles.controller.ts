import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service.js";


const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0],
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.getVehicles();
        if (result.rows.length === 0) {
            res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: result.rows,
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully",
                data: result.rows,
            });
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const getSingleVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehiclesService.getSingleVehicle(vehicleId!);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle retrieved successfully",
                data: result.rows[0],
            });
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    console.log(req.body);
    try {
        const result = await vehiclesService.updateVehicle(vehicleId!, req.body);

        if (result.rows.length == 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows[0],
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehiclesService.deleteVehicle(vehicleId!);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

export const vehiclesController = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
}