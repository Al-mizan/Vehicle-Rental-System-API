import { Pool } from "pg";
import { CONNECTION_STRING } from "./env.js";

if (!CONNECTION_STRING) {
    throw new Error("CONNECTION_STRING is not defined in environment variables.");
}

export const pool = new Pool({
    connectionString: CONNECTION_STRING,
}); 

export const initDB = async () => {
    try {
        // Create ENUM types if they don't exist
        await pool.query(`
            DO $$ BEGIN
                CREATE TYPE role_enum AS ENUM ('admin', 'customer');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await pool.query(`
            DO $$ BEGIN
                CREATE TYPE type_enum AS ENUM ('car', 'bike', 'van', 'SUV');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await pool.query(`
            DO $$ BEGIN
                CREATE TYPE availability_status_enum AS ENUM ('available', 'booked');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await pool.query(`
            DO $$ BEGIN
                CREATE TYPE status_enum AS ENUM ('active', 'cancelled', 'returned');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Create tables
        // users table
        await pool.query(`
            create table if not exists users(
                id serial primary key,
                name varchar(100) not null,
                email varchar(150) unique not null check (email = lower(email)),
                password text not null check (length(password) >= 6),
                phone varchar(20) not null,
                role role_enum default 'customer' not null,
                created_at timestamp default now(),
                updated_at timestamp default now()
            );
        `);
        
        //vehicles table
        await pool.query(`
            create table if not exists vehicles(
                id serial primary key,
                vehicle_name text not null,
                type type_enum default 'car',
                registration_number varchar(100) unique not null,
                daily_rent_price int not null check (daily_rent_price > 0),
                availability_status availability_status_enum default 'available',
                created_at timestamp default now(),
                updated_at timestamp default now()
            );
        `);
        
        // bookings table
        await pool.query(`
            create table if not exists bookings(
                id serial primary key,
                customer_id int references users(id) on delete cascade,
                vehicle_id int references vehicles(id) on delete cascade,
                rent_start_date date not null, 
                rent_end_date date check (rent_end_date > rent_start_date) not null,
                total_price int check (total_price>0) not null,
                status status_enum default 'active',
                created_at timestamp default now(),
                updated_at timestamp default now()
            );
        `);

        console.log("Successfully connected with database!")
        
    } catch (error: any) {
        console.error("Error connecting to the database!");
        
        // If it's an AggregateError, show the individual errors
        if (error instanceof AggregateError) {
            console.error("AggregateError contains multiple errors:");
            error.errors.forEach((err: Error, index: number) => {
                console.error(`  Error ${index + 1}:`, err.message);
            });
        } else {
            console.error("Error message:", error.message); 
        }
    }
};
