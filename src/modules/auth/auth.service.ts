import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { pool } from "../../config/db.js"
import { JWT_SECRET } from "../../config/env.js";


const signUp = async (payload: Record<string, unknown>) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Request body is required');
    }
    const { name, email, password, phone, role } = payload;

    // Validate password length
    if (!password || typeof password !== 'string' || password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    // hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    return await pool.query(
        `insert into users (name, email, password, phone, role) 
         values ($1, $2, $3, $4, $5) 
         returning id, name, email, phone, role`,
        [name, email, hashPassword, phone, role]
    );
}

const signIn = async (payload: Record<string, unknown>) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Request body is required');
    }
    const { email, password } = payload;

    // Validate the user using email
    const result = await pool.query(`select * from users where email=$1`, [email]);

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = result.rows[0];

    // validate the user password using bcrypt
    const match = await bcrypt.compare(password as string, user.password);
    if (!match) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET as string, {
        expiresIn: "7d"
    });

    // Exclude password, created_at, and updated_at from user object
    const { password: _p, created_at: _c, updated_at: _u, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword,
    }
}

export const authService = {
    signUp,
    signIn,
}