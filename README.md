# Vehicle Rental System API

A robust RESTful API for managing vehicle rentals with role-based access control, built with TypeScript and Express.

**Live URL:** [garilagbe-ten.vercel.app](https://garilagbe-ten.vercel.app/)

---

## 🚀 Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure signup and signin flows with token-based authentication
- **Role-Based Access Control (RBAC)**: Separate permissions for Admin and Customer roles
- **Self-Service Guards**: Users can manage their own resources while admins have full access

### Vehicle Management
- **Complete CRUD Operations**: Create, read, update, and delete vehicles
- **Availability Tracking**: Track vehicle availability by type
- **Public & Protected Routes**: Browse vehicles publicly, manage with admin privileges

### Booking System
- **Booking Management**: Create, retrieve, and update bookings
- **Customer Self-Service**: Customers can create and manage their own bookings
- **Admin Override**: Admins can manage all bookings across the system
- **Status Updates**: Flexible booking status management

### Database & Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL database for scalable and reliable data storage
- **Auto Schema Bootstrap**: Automatic creation of enum types and tables on startup
- **Request Logging**: Lightweight middleware for request tracking and debugging

---

## 🛠 Technology Stack

### Core Framework
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2+
- **Language**: TypeScript 5.9+

### Database
- **Database**: Neon PostgreSQL (Serverless PostgreSQL)
- **Driver**: `pg` (node-postgres)

### Authentication & Security
- **JWT**: `jsonwebtoken` for token-based authentication
- **Password Hashing**: `bcryptjs` for secure password storage

### Development Tools
- **TypeScript Compiler**: `tsc` for production builds
- **Development Server**: `tsx` for watch mode and hot reloading
- **Environment Variables**: `dotenv` for configuration management

### Type Definitions
- `@types/express`
- `@types/jsonwebtoken`
- `@types/pg`

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Neon PostgreSQL Account**: Sign up at [neon.tech](https://neon.tech) for a free serverless PostgreSQL database

---

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Al-mizan/Vehicle-Rental-System-API.git
cd Vehicle-Rental-System-API
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Neon PostgreSQL Setup
1. Sign up for a free account at [neon.tech](https://neon.tech)
2. Create a new project in the Neon dashboard
3. Copy your connection string from the Neon dashboard (it will look like: `postgres://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require`)

### 4. Environment Configuration
Create a `.env` file in the project root directory:
```env
PORT=5000
CONNECTION_STRING=postgres://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**:
- Replace `CONNECTION_STRING` with your Neon PostgreSQL connection string from step 3
- Replace `your-super-secret-jwt-key-change-this-in-production` with a strong, random secret key for JWT token signing
- The connection string from Neon already includes SSL mode, which is required for secure connections

### 5. Database Initialization
The application will automatically create required database schemas (enum types and tables) on startup. No manual migration is needed.

---

## 🚦 Usage Instructions

### Development Mode
Start the development server with hot reloading:
```bash
npm run dev
```
The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Production Build
Compile TypeScript to JavaScript:
```bash
npm run build
```

### API Base URL
- **Local**: `http://localhost:5000`
- **API Prefix**: `/api/v1`

---

## 📡 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/signup` | Register a new user | No |
| `POST` | `/api/v1/auth/signin` | Login and receive JWT token | No |

### User Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/users` | Get all users | Admin |
| `PUT` | `/api/v1/users/:userId` | Update user information | Admin or Self |
| `DELETE` | `/api/v1/users/:userId` | Delete a user | Admin |

### Vehicle Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/vehicles` | Create a new vehicle | Admin |
| `GET` | `/api/v1/vehicles` | Get all vehicles | No |
| `GET` | `/api/v1/vehicles/:vehicleId` | Get a single vehicle | No |
| `PUT` | `/api/v1/vehicles/:vehicleId` | Update vehicle information | Admin |
| `DELETE` | `/api/v1/vehicles/:vehicleId` | Delete a vehicle | Admin |

### Booking Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/bookings` | Create a new booking | Customer or Admin |
| `GET` | `/api/v1/bookings` | Get bookings (own bookings for customers, all for admins) | Customer or Admin |
| `PUT` | `/api/v1/bookings/:bookingId` | Update booking status | Customer or Admin |

---

## 🔐 Authentication

All protected endpoints require authentication via JWT token. Include the token in the request header:

```http
Authorization: Bearer <your-jwt-token>
```

### Role Permissions
- **Admin**: Full access to all resources (users, vehicles, bookings)
- **Customer**: Can create and manage their own bookings; read-only access to vehicles

---

## 📝 Example API Requests

### Sign Up
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "customer"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:5000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create Vehicle (Admin Only)
```bash
curl -X POST http://localhost:5000/api/v1/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "type": "car",
    "model": "Toyota Camry",
    "year": 2023,
    "pricePerDay": 50.00,
    "available": true
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer-token>" \
  -d '{
    "vehicleId": 1,
    "startDate": "2024-01-15",
    "endDate": "2024-01-20"
  }'
```

---

## 🏗 Project Structure

```
vehicle_rental_systam/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   ├── db.ts              # Database configuration
│   │   └── env.ts             # Environment variables
│   ├── constants/
│   │   └── roles.ts           # Role definitions
│   ├── middleware/
│   │   ├── auth.ts            # Authentication middleware
│   │   └── logger.ts          # Request logging
│   ├── modules/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management module
│   │   ├── vehicles/          # Vehicle management module
│   │   └── bookings/          # Booking management module
│   └── types/
│       └── express/           # TypeScript type definitions
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License

This project is licensed under the ISC License.

### ISC License

```text
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

For more information, see the [ISC License](https://opensource.org/licenses/ISC) page.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

