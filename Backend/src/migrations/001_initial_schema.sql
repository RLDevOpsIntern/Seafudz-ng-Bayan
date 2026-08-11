-- =====================================================================
-- 001_INITIAL_SCHEMA.SQL
-- Migration 001: Core Database Schema and Initial Seed Data
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supabase_user_id UUID UNIQUE,
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pin_code VARCHAR(10),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'cashier', 'kitchen', 'rider', 'assistant')),
    shift_status VARCHAR(50) DEFAULT 'off_shift' CHECK (shift_status IN ('on_shift', 'off_shift', 'on_break')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supabase_user_id UUID UNIQUE,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    delivery_address TEXT,
    loyalty_points INT DEFAULT 0 CHECK (loyalty_points >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    image TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    spicy_level INT DEFAULT 0,
    preparation_time_mins INT DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RESTAURANT TABLES / SEATING LAYOUT
CREATE TABLE IF NOT EXISTS tables (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    seats INT NOT NULL DEFAULT 4,
    section VARCHAR(100) NOT NULL DEFAULT 'Main Dining',
    status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Reserved', 'Cleaning')),
    shape VARCHAR(50) DEFAULT 'square',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    table_id VARCHAR(100) REFERENCES tables(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    cashier_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    assistant_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    rider_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Take Out' CHECK (type IN ('Dine In', 'Take Out', 'Delivery')),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Unpaid', 'Refunded')),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'GCash', 'Card', 'Maya')),
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    vat NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(100) REFERENCES menu_items(id) ON DELETE RESTRICT,
    snapshot_item_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ASSISTANT CALLS TABLE
CREATE TABLE IF NOT EXISTS assistant_calls (
    id VARCHAR(100) PRIMARY KEY,
    table_id VARCHAR(100) NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
    assistant_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'Call Waiter',
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Attended', 'Resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_employees_supabase_user_id ON employees(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_customers_supabase_user_id ON customers(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_cashier ON orders(cashier_id);
CREATE INDEX IF NOT EXISTS idx_orders_assistant ON orders(assistant_id);
CREATE INDEX IF NOT EXISTS idx_orders_rider ON orders(rider_id);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_assistant_calls_table ON assistant_calls(table_id);
CREATE INDEX IF NOT EXISTS idx_assistant_calls_assistant ON assistant_calls(assistant_id);

-- UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_employees_modtime') THEN
        CREATE TRIGGER update_employees_modtime BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_customers_modtime') THEN
        CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_menu_items_modtime') THEN
        CREATE TRIGGER update_menu_items_modtime BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tables_modtime') THEN
        CREATE TRIGGER update_tables_modtime BEFORE UPDATE ON tables FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_modtime') THEN
        CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_assistant_calls_modtime') THEN
        CREATE TRIGGER update_assistant_calls_modtime BEFORE UPDATE ON assistant_calls FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
    END IF;
END $$;

-- SEED DATA
INSERT INTO employees (id, supabase_user_id, fullname, username, email, role, pin_code, shift_status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '11111111-1111-1111-1111-111111111111', 'Maria Santos', 'cashier1', 'cashier@seafudz.ph', 'cashier', '1234', 'on_shift'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '22222222-2222-2222-2222-222222222222', 'Chef Juan Dela Cruz', 'kitchen1', 'kitchen@seafudz.ph', 'kitchen', '5678', 'on_shift'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '33333333-3333-3333-3333-333333333333', 'Rider Alex Ramos', 'rider1', 'rider@seafudz.ph', 'rider', '9999', 'on_shift'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '44444444-4444-4444-4444-444444444444', 'Assistant Grace', 'assistant1', 'assistant@seafudz.ph', 'assistant', '4321', 'on_shift'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '55555555-5555-5555-5555-555555555555', 'Admin Manager', 'admin1', 'admin@seafudz.ph', 'admin', '0000', 'on_shift')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, supabase_user_id, fullname, email, phone, delivery_address, loyalty_points) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', '66666666-6666-6666-6666-666666666666', 'Juan Tamad', 'customer1@gmail.com', '09171234567', '123 Mabini St, Sampaloc, Manila', 120),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '77777777-7777-7777-7777-777777777777', 'Ana Reyes', 'ana.reyes@yahoo.com', '09189876543', '45 Quezon Ave, Quezon City', 350)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name, description) VALUES
(1, 'Seafood', 'Seafood Mixes, Paellas, and Bilao Feasts'),
(2, 'Shrimp', 'Freshly caught Tiger Prawns and Buttered Shrimp'),
(3, 'Crab', 'Mud Crabs and Soft-Shell Crabs'),
(4, 'Drinks', 'Refreshing Juices, Shakes, and Soft Drinks'),
(5, 'Sides', 'Rice Bowls, Sauces, and Dips')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tables (id, name, seats, section, status, shape) VALUES
('Table 1', 'Table 1', 4, 'Main Dining', 'Available', 'square'),
('Table 2', 'Table 2', 2, 'Main Dining', 'Available', 'round'),
('Table 3', 'Table 3', 6, 'Main Dining', 'Available', 'rectangle'),
('Table 4', 'Table 4', 4, 'Main Dining', 'Available', 'square'),
('Table 5', 'Table 5', 8, 'VIP Family Alcove', 'Available', 'rectangle'),
('Table 6', 'Table 6', 4, 'VIP Family Alcove', 'Available', 'round'),
('Table 7', 'Table 7', 2, 'Alfresco Patio', 'Available', 'round'),
('Table 8', 'Table 8', 4, 'Alfresco Patio', 'Available', 'square'),
('Table 9', 'Table 9', 6, 'Alfresco Patio', 'Available', 'rectangle'),
('Table 10', 'Table 10', 4, 'Main Dining', 'Available', 'square'),
('Table 11', 'Table 11', 2, 'Main Dining', 'Available', 'round'),
('Table 12', 'Table 12', 8, 'VIP Bilao Party', 'Available', 'rectangle')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, name, description, price, category_id, is_available, image) VALUES
('item-001', 'Seafood Bilao Feast', 'Generous combination of grilled prawns, crabs, clams, and squid over garlic butter rice.', 2400.00, 1, true, 'https://images.unsplash.com/photo-1559737671-6386bb0b5f14?w=500&auto=format&fit=crop&q=60'),
('item-002', 'Seafood Cajun Boil', 'Cajun-spiced seafood bucket with corn on the cob, potatoes, sausage, and mixed shellfish.', 1850.00, 1, true, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&auto=format&fit=crop&q=60'),
('item-003', 'Classic Seafood Paella', 'Rich Spanish rice dish loaded with mussels, shrimp, squid rings, and saffron seasoning.', 1650.00, 1, true, 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=500&auto=format&fit=crop&q=60'),
('item-004', 'Grilled Seafood Platter', 'Assorted charcoal-grilled pompano, prawns, stuffed squid, and buttered clams.', 2100.00, 1, true, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60'),
('item-005', 'Crispy Seafood Basket', 'Deep-fried golden fish fillet, calamari rings, and butterfly shrimp served with tartar dip.', 980.00, 1, true, 'https://images.unsplash.com/photo-1579712267685-42da233cb09b?w=500&auto=format&fit=crop&q=60'),
('item-006', 'Garlic Butter Prawns', 'Sauteed jumbo prawns drenched in garlic butter sauce topped with toasted garlic chips.', 1250.00, 2, true, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&auto=format&fit=crop&q=60'),
('item-007', 'Sweet & Chili Crab Bucket', 'Fresh mud crabs simmered in sweet & spicy garlic tomato glaze.', 1950.00, 3, true, 'https://images.unsplash.com/photo-1559737671-6386bb0b5f14?w=500&auto=format&fit=crop&q=60'),
('item-008', 'Fresh Calamansi Juice Pitcher', 'Chilled fresh local calamansi juice infused with honey.', 280.00, 4, true, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60')
ON CONFLICT (id) DO NOTHING;

INSERT INTO assistant_calls (id, table_id, assistant_id, type, status, created_at) VALUES
('CALL-001', 'Table 3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Water Refill', 'Pending', NOW() - INTERVAL '5 minutes'),
('CALL-002', 'Table 7', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Request Bill', 'Pending', NOW() - INTERVAL '2 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, table_id, customer_id, cashier_id, assistant_id, type, status, payment_status, payment_method, subtotal, vat, total, created_at) VALUES
('ORD-1001', 'Table 1', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Dine In', 'Completed', 'Paid', 'GCash', 2400.00, 288.00, 2688.00, NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, menu_item_id, snapshot_item_name, unit_price, quantity) VALUES
(1, 'ORD-1001', 'item-001', 'Seafood Bilao Feast', 2400.00, 1)
ON CONFLICT (id) DO NOTHING;
