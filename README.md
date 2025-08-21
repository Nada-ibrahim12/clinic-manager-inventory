
---

# 🏥 Clinic Manager Inventory System

A **full-stack Laravel + React** application for medical clinics to manage inventories across multiple locations with security, efficiency, and scalability in mind.

This system supports **role-based access**, **supplier integration with invoices**, **inter-inventory transfers**, **expiry & low-stock alerts**, and a **responsive, modern UI**.

---

## 📂 Project Structure

```
clinic-manager-inventory/
│── app/                      # Laravel backend (Models, Controllers, Middleware, etc.)
│   ├── Console/              
│   ├── Exceptions/
│   ├── Http/
│   │   ├── Controllers/      # Controllers (Inventory, Items, Suppliers, Transfers, Reports, etc.)
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/               # Eloquent models (Item, Inventory, Supplier, Transfer, Invoice, etc.)
│   └── Providers/
│
│── bootstrap/                # Laravel bootstrap files
│── config/                   # App configuration files
│── database/                 # Database migrations, factories, seeders
│── lang/                     # Localization files
│── public/                   # Public assets (index.php entry point, images, etc.)
│
│── resources/                # Frontend (React + Inertia + Tailwind + Bootstrap)
│   ├── css/                  # Global styles
│   ├── js/
│   │   ├── Components/       # Shared UI components
│   │   ├── Layouts/          # Layout wrappers
│   │   ├── Pages/            # Inertia React pages (CRUD for Items, Suppliers, Invoices, Transfers, etc.)
│   │   │   ├── Auth/         # Auth pages (Login, Register, ResetPassword, etc.)
│   │   │   ├── Items/
│   │   │   ├── PurchaseInvoices/
│   │   │   ├── PurchaseInvoiceItems/
│   │   │   ├── Transactions/
│   │   │   └── Transfer/
│   │   ├── app.jsx           # Root React component
│   │   ├── router.jsx        # Routing setup
│   │   └── ssr.jsx           # Server-side rendering entry
│   └── views/                # Blade templates (minimal, since Inertia is used)
│
│── routes/                   # Route definitions
│   ├── api.php               # API routes
│   ├── web.php               # Web + Inertia routes
│   ├── auth.php              # Auth routes
│   └── channels.php          # Broadcast channels
│
│── storage/                  # Cache, logs, sessions, file storage
│── tests/                    # PHPUnit tests
│── vendor/                   # Composer dependencies
│
│── .env                      # Environment configuration
│── artisan                   # Laravel CLI
│── composer.json             # PHP dependencies
│── package.json              # Node.js dependencies
│── vite.config.js            # Vite build config
│── tailwind.config.js        # Tailwind setup
│── phpunit.xml               # PHPUnit config
│── README.md                 # Project documentation
```

### 🛠️ Technical Topics Covered

* **Full-Stack Development** → Backend with **Laravel 11** + Frontend with **React 18**
* **RESTful API Design** → Authentication, inventory, suppliers, transactions, invoices
* **Role-Based Access Control (RBAC)** → Implemented via middleware & policies
* **Database Schema Design** → Relational model with MySQL (items, suppliers, transactions, invoices, users)
* **Eloquent ORM** → Efficient data handling with relationships & eager loading
* **State Management in React** → Context API / custom hooks for global data flow
* **Reusable UI Components** → Built with React + TailwindCSS / Bootstrap
* **Form Handling & Validation** → Laravel validation + React form management
* **Error Handling & Notifications** → Backend exceptions + frontend alerts/toasts
* **Authentication & Security** → JWT authentication, CSRF protection, hashed passwords
* **Logging & Auditing** → Laravel logs + admin audit trail of user actions
* **Deployment & Environments** → `.env` configuration, Laravel Artisan, database migrations
* **Version Control** → Git branching strategy for team collaboration

---

## ⚙️ Tech Stack

* **Backend:** Laravel (PHP 8+)
* **Frontend:** React + Inertia.js
* **Styling:** TailwindCSS + Bootstrap 5.3
* **Database:** MySQL / MariaDB (via Eloquent ORM)
* **Auth:** Laravel Breeze / Jetstream
* **Build Tools:** Vite

---

## ✨ Features

* **Multi-Inventory Management** – Manage stock across multiple clinic locations (e.g., Main Store, ER, Lab).
* **Role-Based Access (RBAC)**

  * **Admin:** Has **full control** over all inventories, users, suppliers, transfers, and audit logs.
  * **Inventory Manager:** Limited to their assigned inventory with full CRUD permissions only for that inventory.
* **Item Management** – Add, update, and remove products within assigned inventory.
* **Supplier Integration with Invoices**

  * Managers can receive items directly from suppliers.
  * Every supplier transaction generates a **purchase invoice**.
  * Managers can view a list of invoices and inspect detailed invoice contents.
* **Secure Transfers** –

  * Managers can **initiate transfers only from their own inventory** to another.
  * Stock updates automatically for both the source and destination inventories.
* **Transaction History** –

  * View complete **in/out transaction logs** for every product.
  * Includes supplier receipts, manual adjustments, and transfers.
* **Expiry & Low-Stock Alerts** – Visual warnings for items expiring soon or running low.
* **Audit Logs (Admin only)** – Track all critical actions across the system.
* **Responsive UI** – React + Tailwind + Bootstrap ensures a clean experience across devices.

---

## 👥 Roles & Permissions (Detailed)

| Role                  | Permissions                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Admin**             | - Full access to all inventories.<br>- Manage users, items, suppliers, and transfers globally.<br>- View invoices and audit logs for all activities.                                                                                                                                                                                                               |
| **Inventory Manager** | - Manage only their assigned inventory.<br>- Add, edit, and remove items from their inventory.<br>- Receive items from suppliers → generates purchase invoices.<br>- View all invoices and their detailed contents.<br>- Transfer stock **only from their own inventory** to another.<br>- View complete in/out transaction logs for each item in their inventory. |

---

## 🔌 Core API Endpoints 

### **Auth & Profile**

| Method   | Endpoint    | Description              |
| -------- | ----------- | ------------------------ |
| `POST`   | `/login`    | Authenticate user        |
| `POST`   | `/register` | Register new user        |
| `POST`   | `/logout`   | Logout current user      |
| `GET`    | `/profile`  | Get current user profile |
| `PATCH`  | `/profile`  | Update profile           |
| `DELETE` | `/profile`  | Delete user profile      |

---

### **Inventories**

| Method   | Endpoint            | Description                                             |
| -------- | ------------------- | ------------------------------------------------------- |
| `GET`    | `/inventories`      | List all inventories (admin) or assigned ones (manager) |
| `POST`   | `/inventories`      | Create new inventory (admin only)                       |
| `GET`    | `/inventories/{id}` | Show details of a specific inventory                    |
| `PUT`    | `/inventories/{id}` | Update inventory                                        |
| `DELETE` | `/inventories/{id}` | Delete inventory                                        |

---

### **Items**

| Method   | Endpoint                   | Description                                                  |
| -------- | -------------------------- | ------------------------------------------------------------ |
| `GET`    | `/items`                   | List items                                                   |
| `POST`   | `/items`                   | Create new item (restricted to manager’s inventory or admin) |
| `GET`    | `/items/{id}`              | Show item details                                            |
| `PUT`    | `/items/{id}`              | Update item                                                  |
| `DELETE` | `/items/{id}`              | Delete item                                                  |
| `POST`   | `/items/{id}/add-stock`    | Increase stock (manual adjustment or supplier)               |
| `POST`   | `/items/{id}/remove-stock` | Decrease stock (manual adjustment or consumption)            |
| `GET`    | `/items/{id}/transactions` | Show all in/out transactions for this item                   |

---

### **Categories**

| Method   | Endpoint           | Description     |
| -------- | ------------------ | --------------- |
| `GET`    | `/categories`      | List categories |
| `POST`   | `/categories`      | Create category |
| `GET`    | `/categories/{id}` | Show category   |
| `PUT`    | `/categories/{id}` | Update category |
| `DELETE` | `/categories/{id}` | Delete category |

---

### **Suppliers**

| Method   | Endpoint          | Description           |
| -------- | ----------------- | --------------------- |
| `GET`    | `/suppliers`      | List suppliers        |
| `POST`   | `/suppliers`      | Add new supplier      |
| `GET`    | `/suppliers/{id}` | Show supplier details |
| `PUT`    | `/suppliers/{id}` | Update supplier       |
| `DELETE` | `/suppliers/{id}` | Delete supplier       |

---

### **Purchase Invoices**

| Method   | Endpoint                  | Description                                                |
| -------- | ------------------------- | ---------------------------------------------------------- |
| `GET`    | `/purchase-invoices`      | List all purchase invoices                                 |
| `POST`   | `/purchase-invoices`      | Create new purchase invoice (when receiving from supplier) |
| `GET`    | `/purchase-invoices/{id}` | Show invoice details                                       |
| `PUT`    | `/purchase-invoices/{id}` | Update invoice                                             |
| `DELETE` | `/purchase-invoices/{id}` | Delete invoice                                             |

---

### **Purchase Invoice Items**

| Method   | Endpoint                       | Description            |
| -------- | ------------------------------ | ---------------------- |
| `GET`    | `/purchase-invoice-items`      | List all invoice items |
| `POST`   | `/purchase-invoice-items`      | Add item to invoice    |
| `GET`    | `/purchase-invoice-items/{id}` | Show invoice item      |
| `PUT`    | `/purchase-invoice-items/{id}` | Update invoice item    |
| `DELETE` | `/purchase-invoice-items/{id}` | Remove invoice item    |

---

### **Transfers**

| Method   | Endpoint         | Description                                           |
| -------- | ---------------- | ----------------------------------------------------- |
| `GET`    | `/transfer`      | List all transfers                                    |
| `POST`   | `/transfer`      | Initiate new transfer (from manager’s inventory only) |
| `GET`    | `/transfer/{id}` | Show transfer details                                 |
| `PUT`    | `/transfer/{id}` | Update transfer (e.g., approve/receive)               |
| `DELETE` | `/transfer/{id}` | Cancel transfer                                       |

---

### **Transactions (Stock Movements)**

| Method | Endpoint                   | Description                                      |
| ------ | -------------------------- | ------------------------------------------------ |
| `GET`  | `/transactions`            | List all item transactions (admin/global view)   |
| `GET`  | `/items/{id}/transactions` | Show all in/out transactions for a specific item |


---

## 🧪 Testing the Application (Key Flows)

1. Log in as **Admin** → full control of the system.
2. Log in as **Inventory Manager** → limited to their own inventory.
3. Add new items, link them to suppliers.
4. Receive items from supplier → system generates **invoice**.
5. Open invoice list → view invoice details.
6. Initiate a transfer from one inventory to another → check stock updates.
7. Review **transaction logs** (in/out history).
8. Admin checks **audit logs** for system-wide actions.

---
## 🚀 Deployment

### Backend (Laravel to Shared Hosting/VPS)
1.  **Configure Production `.env`:** Set `APP_ENV=production`, debug to `false`, and use a production database (MySQL/PostgreSQL).
2.  **Upload Files:** Upload the contents of the `backend` directory to your server.
3.  **Install Dependencies:** Run `composer install --optimize-autoloader --no-dev`.
4.  **Run Migrations:** Run `php artisan migrate --force` (ensure database is configured).
5.  **Optimize:** Run `php artisan optimize`.
6.  **Point Web Server:** Configure your web server (Apache/Nginx) to point to the `backend/public` directory.

### Frontend (React to Netlify/Vercel)
1.  **Build for Production:** Run `npm run build` in the `frontend` directory. This creates a `build` folder.
2.  **Deploy:**
    *   **Netlify:** Drag and drop the `build` folder into Netlify's deployment interface.
    *   **Vercel:** Link your GitHub repo and set the root directory to `frontend`.
3.  **Set Environment Variable:** In your hosting platform's dashboard, set the `REACT_APP_API_BASE_URL` variable to your live Laravel API URL (e.g., `https://api.yourclinic.com`).

---

### 🚀 Feature Enhancements (Planned / Future Work)

* **Role-Based Access Control Improvements**

  * More granular permissions (e.g., read-only roles for auditors).
  * Custom role creation for enterprise-level users.

* **Advanced Reporting & Analytics**

  * Generate sales and purchase reports.
  * Stock forecasting and low-stock alerts.
  * Supplier performance tracking.

* **Notifications & Alerts**

  * Email/SMS notifications for low stock.
  * Alerts for upcoming invoice due dates.

* **Multi-Currency & Tax Support**

  * Add support for different currencies.
  * Auto tax calculation per region.

* **Audit Logs & Activity Tracking**

  * Track every action performed by admin, warehouse manager, and suppliers.
  * Detailed logs for security and compliance.

* **Integrations**

  * API integration with ERP/CRM systems.
  * Barcode/QR code scanning for products.

* **UI/UX Enhancements**

  * Dark mode and responsive dashboards.
  * Data export in CSV, Excel, and PDF formats.

* **AI-Powered Insights (Future Scope)**

  * Predict stock needs based on sales history.
  * Smart recommendations for supplier selection.

---


## 🤝 How to Contribute

We welcome contributions! Please follow these steps:

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request and describe your changes.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Laravel & React communities for excellent documentation and tools.
-   Bootstrap for the UI components.

---

**Developer**: Nada Ibrahim  

---
