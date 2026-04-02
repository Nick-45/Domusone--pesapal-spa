# DOMUSONE - Tenant Management System

A comprehensive property management solution for landlords to manage tenants, rent payments, and invoices.

## Features

- **Dual Dashboard**: Separate interfaces for Admin and Tenants
- **Tenant Management**: Add, delete, and manage tenant accounts
- **Rent Invoicing**: Create invoices for individual tenants or groups
- **Payment Processing**: Integrated Pesapal iframe payments
- **Email Notifications**: Automatic credential sending via SMTP
- **PDF Reports**: Generate rent statements for tenants
- **Capacity Management**: Set apartment capacity limits

## Tech Stack

- **Frontend**: React 18, React Router, Styled Components
- **Backend**: Netlify Functions (Serverless)
- **Database**: MongoDB
- **Authentication**: JWT
- **Payments**: Pesapal Integration
- **Email**: Nodemailer with Gmail SMTP
- **PDF Generation**: jsPDF

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your credentials
4. Run locally: `npm start`
5. Deploy to Netlify: Connect your GitHub repository

## Environment Variables

Create a `.env` file with:
