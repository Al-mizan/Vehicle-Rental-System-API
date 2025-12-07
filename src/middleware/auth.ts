import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config/env.js";

// higher order function
const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ 
                    success: false,
                    message: "you are not authorized!" 
                })
            }
            const decode = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
            req.user = decode;

            let check_self = false;
            if(roles.includes('self')) {
                const userIdFromParams = req.params.id;
                const userIdFromToken = decode.id as string;
                
                if(userIdFromParams && userIdFromToken && userIdFromToken.toString() === userIdFromParams.toString()) {
                    check_self = true;
                }
            }
            if (roles.length && !(roles.includes(decode.role as string) || check_self)) {
                return res.status(403).json({
                    success: false,
                    message: "you are not allowed!",
                });
            }
            next();

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }
}

export default auth;