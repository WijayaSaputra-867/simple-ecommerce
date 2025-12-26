# 🛒 Simple E-commerce Shopping Cart

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A **robust Full Stack E-commerce MVP** built as a technical assessment. This project demonstrates a **secure, database-driven shopping cart system** integrated with **background queues** and **scheduled reporting** using Laravel and React (Inertia.js).

---

## ✨ Key Features

### 🛍️ Core Functionality

- **Authentication**: Secure login & registration using **Laravel Breeze**.
- **Persistent Cart**: Cart items are stored in the database (`carts` table) and linked to the authenticated user (not Session / LocalStorage), ensuring persistence across devices.
- **Product Management**: Dynamic dashboard displaying products with real-time stock availability.

### ⚙️ Backend Logic & Security

- **Database Transactions**: Checkout process is wrapped in `DB::transaction` to ensure atomic operations (Order creation, Order Items insertion, and Stock reduction).
- **Stock Validation**: Prevents over-ordering with server-side validation during **Add to Cart** and **Checkout**.

### 📩 Background Jobs & Automation

- **Low Stock Alert (Queue)**: Automatically dispatches `LowStockAlertJob` when a product’s stock drops below **5**.
- **Daily Sales Report (Scheduler)**: `DailySalesReportJob` runs daily at **23:00** to email the admin a summary of daily revenue and items sold.

---

## 🛠️ Tech Stack

- **Backend**: Laravel, MySQL
- **Frontend**: React.js, Inertia.js (SPA Monolith)
- **Styling**: Tailwind CSS
- **Mail & Testing**: Mailpit (SMTP Mocking)

---

## 🚀 Installation Guide

Follow the steps below to run the project locally.

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/WijayaSaputra-867/simple-ecommerce.git
cd YOUR_REPO_NAME

# Backend dependencies
composer install

# Frontend dependencies
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

Configure your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=

# Mailpit Configuration (for email testing)
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

### 3. Database Migration & Seeding

This command will create all tables and seed dummy products along with a test user.

```bash
php artisan migrate:fresh --seed
```

**Default Test User**

- Email: `test@example.com`
- Password: `password`

---

## 🏃‍♂️ Running the Application

To ensure all features work correctly (queues & emails included), run the following commands in **separate terminals**:

### Terminal 1 – Laravel Server & Frontend (Vite)

```bash
composer run dev
```

### Terminal 2 – Queue Worker (Required for Emails)

```bash
php artisan queue:work
```

### Access URLs

- Application: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Mailpit Inbox: [http://127.0.0.1:8025](http://127.0.0.1:8025)

---

## 🧪 Testing Walkthrough (QA)

### Scenario 1: Checkout & Low Stock Alert

1. Login using the test credentials.
2. Add a product to the cart (e.g. **MacBook Pro** with initial stock of 10).
3. Increase quantity to **6** (remaining stock becomes **4**).
4. Click **Checkout**.

**Expected Result**:

- Order is saved to the database.
- Product stock is updated.
- Since stock is below 5, a **Low Stock Alert** email is sent.
- Check Mailpit to verify the email.

---

### Scenario 2: Daily Sales Report (Scheduler)

The scheduler runs automatically at **23:00**, but you can trigger it manually for testing.

```bash
php artisan schedule:test
```

- Select `DailySalesReportJob` (or press `0`).

**Expected Result**:

- A **Daily Sales Report** email is sent to the admin.
- The report contains total revenue and items sold for the day.
- Check Mailpit to verify the email.

---

## 📂 Project Structure Highlights

- **Controllers**: `app/Http/Controllers/` (Product, Cart, Checkout)
- **Jobs**: `app/Jobs/` (Email & background job logic)
- **Scheduler**: `routes/console.php`
- **Frontend Pages**: `resources/js/Pages/` (Dashboard, Cart)

---

<p align="center">
  Submitted by <strong>M. Wijaya Saputra</strong><br>
</p>
