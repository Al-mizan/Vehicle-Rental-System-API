import { pool } from "../../config/db.js";


const createVehicle = async (payload: Record<string, unknown>) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Request body is required');
    }
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    return await pool.query(`
        insert into vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at) 
        values ($1, $2, $3, $4, $5, now(), now()) 
        returning id, vehicle_name, type, registration_number, daily_rent_price, availability_status
        `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
}

const getVehicles = async () => {
    return pool.query(`select id, vehicle_name, type, registration_number, daily_rent_price, availability_status from vehicles`);
}

const getSingleVehicle = async (id: string) => {
    return pool.query(`select id, vehicle_name, type, registration_number, daily_rent_price, availability_status from vehicles where id=$1`,[id]);
}

const updateVehicle = async (id: string, payload: Record<string, unknown>) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Request body is required');
    }
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    return await pool.query(
        `update vehicles set vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5, updated_at=now() 
        where id=$6 
        returning id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
    );
}

const deleteVehicle = async (id: string) => {
    const bookings = await pool.query(`select status from bookings where vehicle_id=$1`, [id]);
    const hasActiveBookings = bookings.rows.some((booking: { status: string }) => booking.status === "active");
    if(hasActiveBookings) {
        throw new Error("Cannot delete vehicle with active bookings");
    }
    return await pool.query(`delete from vehicles where id=$1`, [id]);
}

export const vehiclesService = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
}