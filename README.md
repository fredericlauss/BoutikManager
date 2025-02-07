# E-commerce Application

A full-stack e-commerce application built with Angular and NestJS.

## Prerequisites

Before running the application, ensure you have:
- Docker installed
- The following ports available on your machine:
  - `4200`: Frontend (Angular)
  - `3000`: Backend (NestJS)
  - `5432`: PostgreSQL Database

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. (Optional) Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. Set up environment variables:
   Then edit `.env` file with .env.example

4. Run the entire application stack with Docker:
   ```bash
   docker compose up
   ```

The application will be available at:
- Frontend: http://localhost:4200 
- Backend: http://localhost:3000

## Access URLs

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3000`

## Features

- User authentication (login/register)
- Product management (CRUD operations)
- Order management
- Role-based access control (Admin/Client)
- Pre-loaded product database
- Admin Dashboard with:
  - Total orders count
  - Best-selling products chart
  - Low stock alerts

## Demo Data

The application comes with pre-loaded products in the database, so you can start exploring the features immediately.

### Getting Started

1. Register a new account at `http://localhost:4200/register`
   - You can choose between Admin and Client roles (demo purpose)
   - Admin role gives you full access to product and order management
   - Client role allows you to view products and manage their own orders

2. Login with your credentials at `http://localhost:4200/login`

### Available Routes

Frontend:
- `/login` - Login page
- `/register` - Registration page
- `/products` - Product list (requires authentication)
- `/products/new` - Create new product (Admin only)
- `/products/edit/:id` - Edit product (Admin only)
- `/cart` - Shopping cart (Client only)
- `/orders` - User orders list (Client)
- `/admin/orders` - Manage all orders (Admin only)
- `/admin/dashboard` - Statistics dashboard (Admin only)
  - View total orders
  - Chart of best-selling products
  - Monitor low stock products

API Endpoints:
- Auth:
  - `POST /auth/register` - Register new user
  - `POST /auth/login` - Login

- Products:
  - `GET /products` - Get all products
  - `GET /products/:id` - Get single product
  - `POST /products` - Create product (Admin only)
  - `PUT /products/:id` - Update product (Admin only)
  - `DELETE /products/:id` - Delete product (Admin only)

- Orders:
  - `POST /orders` - Create order (Client)
  - `GET /orders` - Get user's orders (Client)
  - `GET /orders/all` - Get all orders (Admin only)
  - `GET /orders/:id` - Get single order
  - `PATCH /orders/:id/status` - Update order status (Admin only)
  - `DELETE /orders/:id` - Delete order (Admin only) Demo purpose only: Order deletion would not be available in production

## Development

The application is containerized using Docker and includes:
- Angular frontend
- NestJS backend
- PostgreSQL database

## Notes

  **Order Deletion**: 
   - Demo: Orders can be deleted directly
   - Production: Orders should be archived to maintain data integrity with products and order history

  **User Role Selection**: 
   - Demo: Users can choose their role (Admin/Client) during registration
   - Production: Role assignment would be managed by administrators

- The database is pre-seeded with sample products for testing purposes.
- Admin users have full CRUD access to products and orders, while regular users can only view products and manage their own orders.

## Technologies Used

- Frontend:
  - Angular
  - TypeScript
  - Chart.js

- Backend:
  - NestJS
  - TypeORM