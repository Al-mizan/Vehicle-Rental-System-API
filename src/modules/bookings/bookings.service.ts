import { pool } from "../../config/db.js";

// Todos:
// 1. vehicles availability_status is available or booked?
// 2. total price calculate = daily_rent_price * (rent_end_date - rent_start_date)
const createBooking = async (payload: Record<string, unknown>) => {

    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // Validate required fields
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error('customer_id, vehicle_id, rent_start_date, and rent_end_date are required');
    }

    // Start a transaction
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const vehicle_details = await client.query(
            `select vehicle_name, availability_status, daily_rent_price from vehicles where id = $1 FOR UPDATE`,
            [vehicle_id]
        );

        if (vehicle_details.rows.length === 0) {
            throw new Error("Vehicle not found!");
        }

        let vehicle = vehicle_details.rows[0];
        if (vehicle.availability_status === "booked") {
            throw new Error("The vehicle must be available!");
        }
        const daily_rent_price = vehicle.daily_rent_price;

        // Calculate days difference properly
        const startDate = new Date(rent_start_date as string);
        const endDate = new Date(rent_end_date as string);
        const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDifference <= 0) {
            throw new Error("Rent end date must be after rent start date!");
        }

        const total_price = Number(daily_rent_price) * daysDifference;
        const status = "active";

        // Insert into bookings table
        const result = await client.query(`
            insert into bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, created_at, updated_at) 
            values ($1, $2, $3, $4, $5, $6, now(), now()) 
            returning id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
            `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]);

        // Update vehicle availability status to "booked"
        await client.query(
            `update vehicles set availability_status = $1, updated_at = now() where id = $2`,
            ["booked", vehicle_id]
        );

        // Commit the transaction
        await client.query('COMMIT');

        let data = result.rows[0];
        const { availability_status: _, ...vehicle_name_price } = vehicle;
        data["vehicle"] = vehicle_name_price;
        return data;

    } catch (error) {
        // Rollback the transaction on any error
        await client.query('ROLLBACK');
        throw error;
    } finally {
        // Release the client back to the pool
        client.release();
    }
}

// Todos: inner join
const getBookings = async (role: string, id: string) => {
    if (role === "admin") {
        const result = await pool.query(`
            SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, 
                b.created_at, b.updated_at,
                json_build_object(
                    'name', u.name,
                    'email', u.email
                ) as customer,
                json_build_object(
                    'vehicle_name', v.vehicle_name,
                    'registration_number', v.registration_number
                ) as vehicle
                FROM bookings b
                INNER JOIN users u ON u.id = b.customer_id
                INNER JOIN vehicles v ON v.id = b.vehicle_id
                ORDER BY b.id ASC
            `);

        return result.rows.map(row => ({
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: row.customer,
            vehicle: row.vehicle
        }));
    }
    else {
        const result = await pool.query(`
            SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, b.created_at, 
                b.updated_at,
                json_build_object(
                    'vehicle_name', v.vehicle_name,
                    'registration_number', v.registration_number,
                    'type', v.type
                    ) as vehicle
                FROM bookings b
                INNER JOIN vehicles v ON v.id = b.vehicle_id
                WHERE b.customer_id = $1
                ORDER BY b.id ASC
            `, [id]);

        return result.rows.map(row => ({
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: row.vehicle
        }));
    }
}

const updateBooking = async (id: string, status: string, user_id: string) => {
    // Start a transaction
    const client = await pool.connect();
    try {
        let data;
        await client.query('BEGIN');

        // First, get the booking details to check dates
        const bookingCheck = await client.query(
            `SELECT id, customer_id, vehicle_id, rent_start_date, rent_end_date, status 
             FROM bookings WHERE id = $1 FOR UPDATE`,
            [id]
        );

        if (bookingCheck.rows.length === 0) {
            await client.query('COMMIT');
            return [];
        }

        const booking = bookingCheck.rows[0];

        // Auto-return: check if rent_end_date has passed and booking is still active
        const endDate = new Date(booking.rent_end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (booking.status === "active" && endDate < today) {
            status = "returned";
        }

        const result = status === "cancelled" ?
            await client.query(`update bookings set status=$1, updated_at=now()
                where id=$2 AND customer_id=$3
                returning id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status   
            `, ['cancelled', id, user_id])

            : await client.query(`update bookings set status=$1, updated_at=now()
                where id=$2
                returning id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status   
            `, ['returned', id]);

        data = result.rows;
        if (data.length === 0) {
            await client.query('COMMIT');
            return data;
        }

        // Update vehicle availability status to "available" for both cancelled and returned
        const vehicle = await client.query(
            `update vehicles set availability_status = $1, updated_at = now() where id = $2 returning availability_status`,
            ["available", data[0].vehicle_id]
        );

        if (status === "returned") {
            data[0]["vehicle"] = vehicle.rows[0];
        }

        // Commit the transaction
        await client.query('COMMIT');
        return data;

    } catch (error) {
        // Rollback the transaction on any error
        await client.query('ROLLBACK');
        throw error;
    } finally {
        // Release the client back to the pool
        client.release();
    }
}


export const bookingService = {
    createBooking,
    getBookings,
    updateBooking
}