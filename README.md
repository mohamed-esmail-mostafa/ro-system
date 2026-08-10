# RO System — Water Treatment Plant SaaS Platform

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-3.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

A modern, multi-tenant **SaaS Application for Reverse Osmosis (RO) Water Treatment Plant Management**. Built for plant operators, station managers, chemical engineers, and enterprise admins to monitor RO unit performance, track chemical inventory, log operational readings, manage maintenance activities, and generate automated daily reports.

---

## 🚀 Features

### 🏢 Multi-Tenant SaaS Administration
- **Company Management**: Super Admin controls for tenant onboarding, subscription tiers, and company-level settings.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Enterprise Admins, Station Managers, Maintenance Engineers, and Plant Operators.

### 🏭 Station & RO Unit Infrastructure
- **Station Operations**: Register and manage multiple RO plant locations, assign dedicated plant operators, and monitor overall health status.
- **RO Unit Customization**: Configure RO units with specialized parameters (e.g., pH, TDS, Conductivity, Pressure, Flow Rate, Temperature, Turbidity).
- **Category & Parameter Templates**: Group parameters into operational stages (Pre-treatment, RO Membrane, Post-treatment, Permeate, Concentrate).

### 📊 Shift Reading Logging & Visual Analytics
- **Operational Data Entry**: Intuitive shift logging interface for plant operators with automated min/max threshold checks.
- **Warning & Alerting Systems**: Immediate visual warnings when operational readings fall outside calibrated safe ranges.
- **Interactive Data Charts**: Dynamic performance charts powered by Recharts for historical trend analysis.

### 📑 Automated Daily Reports & Recommendations
- **Daily Performance Calculation**: Automated compilation of daily parameter averages, minimums, maximums, and operational anomalies.
- **Action Recommendations**: Smart recommendations based on reading deviations to optimize membrane lifespan and chemical dosing.

### 📦 Inventory & Material Logistics
- **Chemical & Spare Stock Tracking**: Monitor inventory levels for water treatment chemicals, anti-scalants, cartridge filters, and spare parts.
- **Material Issuing Form (MIF)**: Requisition and approval workflow for issuing inventory items to specific RO units or stations.
- **Material Receiving Form (MRF)**: Log stock arrivals, supplier receipts, and inventory updates.

### 🛠️ Maintenance Activities & Task Management
- **Work Orders & Tasks**: Schedule routine maintenance, membrane cleaning (CIP), filter replacements, and equipment overhauls.
- **Attachment Uploads**: Attach inspection logs, service reports, and images directly to maintenance tasks.

### 🔐 Modern Security & Internationalization
- **Fortify Authentication**: Secure login, password reset, email verification, and two-factor authentication (2FA).
- **WebAuthn / Passkey Support**: Biometric and hardware key authentication support via `@laravel/passkeys`.
- **Multi-Language Support (i18n)**: Full English and Arabic localized UI.

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: [Laravel 12](https://laravel.com) (PHP 8.3+)
- **Authentication**: [Laravel Fortify](https://laravel.com/docs/fortify) with Passkey / WebAuthn integration
- **Database ORM**: Eloquent (Supports SQLite, MySQL, PostgreSQL)
- **Media & Image Processing**: Cloudinary & Intervention Image

### **Frontend**
- **Core**: [React 19](https://react.dev) with [TypeScript](https://www.typescriptlang.org)
- **Adapter**: [Inertia.js 3](https://inertiajs.com) (Monolithic SPA architecture)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com/) primitives
- **Icons & Animations**: [Lucide React](https://lucide.dev) & [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org)
- **Internationalization**: [i18next](https://www.i18next.com/) / `react-i18next`

### **Tooling & Quality Assurance**
- **Bundler**: [Vite 8](https://vitejs.dev/) with `@laravel/vite-plugin-wayfinder`
- **Testing**: [Pest PHP 4](https://pestphp.com/) & Laravel Test Suite
- **Static Analysis**: [Larastan / PHPStan](https://github.com/larastan/larastan)
- **Code Style**: [Laravel Pint](https://laravel.com/docs/pint), [ESLint](https://eslint.org/), and [Prettier](https://prettier.io/)

---

## 📁 Project Structure Overview

```
ro-saas-project/
├── app/
│   ├── Http/Controllers/       # Inertia Controllers & API logic
│   ├── Models/                 # Eloquent Domain Models (Company, Station, RoUnit, etc.)
│   ├── Actions/                # Fortify Auth & Domain Actions
│   └── Services/               # Core business services & report generators
├── database/
│   ├── migrations/             # Database schema migrations
│   └── seeders/                # Default roles, permissions, and initial data
├── resources/
│   ├── js/
│   │   ├── components/         # Reusable UI components & Radix primitives
│   │   ├── layouts/            # Dashboard & Auth layouts
│   │   ├── pages/              # React Page components (Inertia routing)
│   │   │   ├── companies/      # Tenant management
│   │   │   ├── stations/       # RO Station management
│   │   │   ├── ro-units/       # RO Unit settings & parameters
│   │   │   ├── readings/       # Operational shift readings
│   │   │   ├── reports/        # Daily reports & recommendations
│   │   │   ├── inventory/      # Stock tracking & warehousing
│   │   │   ├── mif/ & mrf/     # Material Issuing & Receiving forms
│   │   │   └── settings/       # User profile, security & appearance
│   │   ├── i18n/               # Localization files (En/Ar)
│   │   └── types/              # TypeScript definitions
│   └── views/                  # Blade entry template
└── routes/                     # Modular route definitions (web, stations, ro-units, etc.)
```

---

## ⚡ Getting Started

### **Prerequisites**
Ensure you have the following installed on your machine:
- **PHP**: `^8.3`
- **Composer**: `^2.x`
- **Node.js**: `^20.x` or higher
- **NPM**: `^10.x`

### **Installation Steps**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mohamed-esmail-mostafa/ro-system.git
   cd ro-system
   ```

2. **Install PHP and Node dependencies**:
   ```bash
   composer install
   npm install
   ```

3. **Set up Environment Variables**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Run Database Migrations & Seeders**:
   ```bash
   # Create database file if using SQLite
   touch database/database.sqlite

   # Execute migrations
   php artisan migrate --seed
   ```

5. **Start Development Servers**:
   Run Laravel backend server and Vite frontend compiler concurrently:
   ```bash
   composer run dev
   ```
   *Or launch separately:*
   ```bash
   # Terminal 1: Backend
   php artisan serve

   # Terminal 2: Frontend
   npm run dev
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:8000`.

---

## 📜 Available Scripts

### **Backend Scripts (Composer)**
- `composer run dev` — Starts Laravel dev process.
- `composer run setup` — Full setup (install dependencies, copy `.env`, generate key, migrate, build assets).
- `composer run test` — Runs configuration check, linter, static analysis, and Pest test suite.
- `composer run lint` — Runs Laravel Pint code formatter.
- `composer run types:check` — Runs PHPStan analysis.

### **Frontend Scripts (NPM)**
- `npm run dev` — Starts Vite development server.
- `npm run build` — Builds production assets.
- `npm run types:check` — Checks TypeScript types (`tsc --noEmit`).
- `npm run lint` — Runs ESLint and fixes style issues.
- `npm run format` — Formats frontend codebase using Prettier.

---

## 🧪 Testing & Quality Assurance

Run the test suite to ensure code integrity:

```bash
# Run Pest PHP tests
php artisan test

# Check PHPStan static analysis
npm run types:check && composer run types:check
```

---

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).
