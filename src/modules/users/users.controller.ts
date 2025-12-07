import { Request, Response } from "express"
import { userService } from "./users.service.js";


const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.userId;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user_role = req.user?.role;
        const user_id = req.user?.id;
        const result = await userService.updateUser(id, req.body, user_role, user_id);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.userId;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const result = await userService.deleteUser(id);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

export const userController = {
    getUsers,
    updateUser,
    deleteUser,
}
