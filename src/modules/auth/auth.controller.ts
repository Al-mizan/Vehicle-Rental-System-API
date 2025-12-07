import { Request, Response } from "express";
import { authService } from "./auth.service.js";


const signUp = async (req: Request, res: Response) => {
    try {
        const result = await authService.signUp(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        })
    }
};

const signIn = async (req: Request, res: Response) => {
    try {
        const result = await authService.signIn(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error: any) {
        const statusCode = error.message.includes('not found') || error.message.includes('Invalid') ? 401 : 500;
        res.status(statusCode).json({
            success: false,
            message: (error as Error).message,
        })
    }
};


export const authController = {
    signUp,
    signIn
}