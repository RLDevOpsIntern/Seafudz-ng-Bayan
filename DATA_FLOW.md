# System Data Flow & Architecture Documentation

**Project**: Seafudz ng Bayan POS & Restaurant System  
**Architecture Pattern**: Supabase Auth (Identity Only) + Google Cloud Platform (Cloud Run API & Cloud SQL PostgreSQL)

---

## 🏛️ 1. Architecture & System Overview

The application uses a decoupled hybrid cloud architecture:
- **Supabase Auth**: Dedicated exclusively to identity management, user registration, password hashing, and JWT access token issuance.
- **GCP Cloud Run**: Hosts the Express.js Node.js REST API server handling all application business logic and authorization middleware.
- **GCP Cloud SQL (PostgreSQL)**: Production relational database storing all domain data (`employees`, `customers`, `orders`, `order_items`, `menu_items`, `tables`, `assistant_calls`).

```mermaid
graph TD
    Client["React 19 Frontend App\n(POS, KDS, Assistant, Rider, Storefront)"]
    SupaAuth["Supabase Auth Service\n(auth.users Identity Provider)"]
    GCPAPI["GCP Cloud Run Express API Server\n(JWT Verification & Business Logic)"]
    GCPDB[("GCP Cloud SQL PostgreSQL\n(seafudz-db Instance)")]

    Client -- "1. Authenticate (Email/Pass)" --> SupaAuth
    SupaAuth -- "2. Issue JWT Bearer Token" --> Client
    Client -- "3. REST Request + Bearer JWT Token" --> GCPAPI
    GCPAPI -- "4. Verify Token" --> SupaAuth
    GCPAPI -- "5. Query / Update Records" --> GCPDB
    GCPDB -- "6. Return Data Set" --> GCPAPI
    GCPAPI -- "7. JSON Response" --> Client
```

---

## 🔄 2. Data Flow Sequences

### Sequence A: Authentication & Session Initialization

```mermaid
sequenceDiagram
    participant User as React Frontend
    participant Supabase as Supabase Auth
    participant GCP as GCP Express Backend
    participant DB as GCP Cloud SQL

    User->>Supabase: signInWithPassword(email, password)
    Supabase-->>User: Returns Session { access_token (JWT), user.id (UUID) }
    User->>GCP: GET /api/auth/me (Header: Authorization: Bearer JWT)
    GCP->>Supabase: supabase.auth.getUser(JWT)
    Supabase-->>GCP: Returns Valid User Object { id: "SUPABASE_UUID" }
    GCP->>DB: SELECT * FROM employees WHERE supabase_user_id = 'SUPABASE_UUID'
    DB-->>GCP: Employee Record { id, fullname, role, pin_code, shift_status }
    GCP-->>User: JSON User Profile Response
```

---

### Sequence B: Order Creation & Kitchen Prep Pipeline

```mermaid
sequenceDiagram
    participant POS as POS / Storefront
    participant API as GCP Cloud Run API
    participant DB as GCP Cloud SQL
    participant KDS as Kitchen Display System

    POS->>API: POST /api/orders (Cart Items, Table ID, Type)
    API->>DB: INSERT INTO orders (subtotal, vat, total, status='Pending')
    API->>DB: INSERT INTO order_items (snapshot_item_name, unit_price, quantity)
    DB-->>API: Order Created (ORD-1001)
    API-->>POS: 201 Created + Printable Receipt Details
    KDS->>API: GET /api/kitchen/orders (Polling/Stream)
    API->>DB: SELECT * FROM orders WHERE status IN ('Pending', 'Preparing')
    DB-->>API: Active Kitchen Orders List
    API-->>KDS: Render Kitchen Tickets
    KDS->>API: PATCH /api/orders/ORD-1001/status (status='Preparing')
    API->>DB: UPDATE orders SET status = 'Preparing' WHERE id = 'ORD-1001'
```

---

### Sequence C: Floor Assistant Table Payment & Bill Settlement Flow

```mermaid
sequenceDiagram
    participant Guest as Dining Guest (Table 3)
    participant Assistant as Floor Assistant Portal
    participant API as GCP Cloud Run API
    participant DB as GCP Cloud SQL

    Guest->>Assistant: Requests Bill / Check (or triggers 'Request Bill' call)
    Assistant->>API: POST /api/assistant/call (table_id='Table 3', type='Request Bill')
    API->>DB: INSERT INTO assistant_calls (table_id, type, status='Pending')
    Assistant->>API: GET /api/orders?table_id=Table 3
    API-->>Assistant: Returns Active Order (Subtotal: ₱2,400, VAT: ₱288, Total: ₱2,688)
    Assistant->>Guest: Collects Payment (Cash, GCash, Card, or Maya)
    Assistant->>API: PATCH /api/orders/ORD-1001/pay (payment_method, assistant_id)
    API->>DB: UPDATE orders SET payment_status='Paid', status='Completed', assistant_id=EMP_ID
    API->>DB: UPDATE assistant_calls SET status='Resolved' WHERE table_id='Table 3'
    API->>DB: UPDATE tables SET status='Available' WHERE id='Table 3'
    API-->>Assistant: Settlement Confirmed + Issue Customer Receipt
```

---

### Sequence D: Delivery Rider Dispatch & Progression Flow

```mermaid
sequenceDiagram
    participant Customer as Online Customer
    participant Assistant as Assistant / Dispatcher
    participant Rider as Delivery Rider Portal
    participant API as GCP Cloud Run API
    participant DB as GCP Cloud SQL

    Customer->>API: POST /api/orders (type='Delivery', delivery_address)
    API->>DB: INSERT INTO orders (type='Delivery', customer_id)
    Assistant->>API: PATCH /api/orders/ORD-8821/dispatch (rider_id)
    API->>DB: UPDATE orders SET rider_id = EMP_RIDER_ID, status = 'Preparing'
    Rider->>API: GET /api/rider/deliveries (rider_id)
    API-->>Rider: Active Delivery Route & Address Details
    Rider->>API: PATCH /api/rider/deliveries/ORD-8821/status (status='Delivered')
    API->>DB: UPDATE orders SET status = 'Completed', payment_status = 'Paid'
```

---

## 📊 3. Relational Schema & Database Mapping

All database entities reside on **GCP Cloud SQL (PostgreSQL)**:

```mermaid
erDiagram
    EMPLOYEES ||--o{ ORDERS : "cashier_id / assistant_id / rider_id"
    CUSTOMERS ||--o{ ORDERS : "customer_id"
    TABLES ||--o{ ORDERS : "table_id"
    CATEGORIES ||--o{ MENU_ITEMS : "category_id"
    MENU_ITEMS ||--o{ ORDER_ITEMS : "menu_item_id"
    ORDERS ||--|{ ORDER_ITEMS : "order_id"
    TABLES ||--o{ ASSISTANT_CALLS : "table_id"
    EMPLOYEES ||--o{ ASSISTANT_CALLS : "assistant_id"
```

### Table Definitions Summary:
- **`employees`**: Staff profiles linked to `supabase_user_id` (`admin`, `manager`, `cashier`, `kitchen`, `rider`, `assistant`).
- **`customers`**: Buyer profiles linked to `supabase_user_id` (`delivery_address`, `phone`, `loyalty_points`).
- **`categories`**: Food categories (`Seafood`, `Shrimp`, `Crab`, `Drinks`, `Sides`).
- **`menu_items`**: Dish catalog with pricing, images, preparation time, and availability.
- **`tables`**: Dining zones and real-time seating statuses (`Available`, `Occupied`, `Reserved`, `Cleaning`).
- **`orders`**: Master transaction records linking Customer, Cashier, Assistant, Rider, and Table.
- **`order_items`**: Line-item breakdown using historical pricing snapshots.
- **`assistant_calls`**: Real-time floor service alerts (`Water Refill`, `Request Bill`, `Call Waiter`, `Clean Table`).

---

## ⚙️ 4. Environment Variables Configuration

### Frontend Environment (`Frontend/.env`):
```env
VITE_SUPABASE_URL=https://nvtozwvlbjqbujnzafoh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_mSRd5dUpuEeF0OcFHdSAKg_13Ay72-K
VITE_GCP_API_URL=https://seafudz-backend-a1b2c3d4-as.a.run.app
```

### GCP Cloud Run Backend Environment Variables:
```env
PORT=8080
SUPABASE_URL=https://nvtozwvlbjqbujnzafoh.supabase.co
SUPABASE_ANON_KEY=sb_publishable_mSRd5dUpuEeF0OcFHdSAKg_13Ay72-K
DATABASE_URL=postgresql://postgres:PASSWORD@CLOUD_SQL_IP:5432/seafudz_db
NODE_ENV=production
```
