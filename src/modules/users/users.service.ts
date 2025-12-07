import { pool } from "../../config/db.js"


const getUsers = async () => {
    return pool.query(`select id, name, email, phone, role from users`);
}

const updateUser = async (id: string, payload: Record<string, unknown>, user_role: string, user_id: string) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Request body is required');
    }
    const { name, email, phone, role } = payload;
    if(user_role === "admin") {
        return await pool.query(
            `update users set name=$1, email=$2, phone=$3, role=$4, updated_at=now() where id=$5 returning id, name, email, phone, role`,
            [name, email, phone, role, id]
        );
    }
    else {
        if(user_id !== id) {
            throw new Error("you are not authorized!");
        }
        // Customers cannot change their own role - get existing role
        const existingUser = await pool.query(`select role from users where id=$1`, [id]);
        const userRole = existingUser.rows[0]?.role || role;
        return await pool.query(
            `update users set name=$1, email=$2, phone=$3, role=$4, updated_at=now() where id=$5 returning id, name, email, phone, role`,
            [name, email, phone, userRole, id]
        );
    }
}

const deleteUser = async (id: string) => {
    const bookings = await pool.query(`select status from bookings where customer_id=$1`, [id]);
    const hasActiveBookings = bookings.rows.some((booking: { status: string }) => booking.status === "active");
    if(hasActiveBookings) {
        throw new Error("Cannot delete user with active bookings");
    }
    return await pool.query(`delete from users where id=$1`, [id]);
}

export const userService = {
    getUsers,
    updateUser,
    deleteUser,
} 