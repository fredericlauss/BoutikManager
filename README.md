# E-commerce Application

A full-stack e-commerce application built with Angular and NestJS.

## Quick Start

1. Clone the repository
2. Run the entire application stack with Docker:
   ```bash
   docker compose up
   ```

The application will be available at:
- Frontend: http://localhost:4200 
- Backend: http://localhost:3000

## Access URLs

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3000`
- API Documentation (Swagger): `http://localhost:3000/api`

## Features

- User authentication (login/register)
- Product management (CRUD operations)
- Order management
- Role-based access control (Admin/Client)
- Pre-loaded product database

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
  - `DELETE /orders/:id` - Delete order (Admin only)

## Development

The application is containerized using Docker and includes:
- Angular frontend
- NestJS backend
- PostgreSQL database

### Environment Variables

All necessary environment variables are configured in the `docker-compose.yml` file.

## Notes

- For demonstration purposes, the registration form allows selecting user roles (Admin/Client). In a production environment, this would typically be handled differently.
- The database is pre-seeded with sample products for testing purposes.
- Admin users have full CRUD access to products and orders, while regular users can only view products and manage their own orders.

## Technologies Used

- Frontend:
  - Angular
  - TypeScript

- Backend:
  - NestJS
  - TypeORM