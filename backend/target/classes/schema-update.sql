-- IMPORTANT: Tables are no longer dropped and recreated on startup to preserve order data
-- The following lines are commented out to prevent data loss

-- -- Drop existing tables with dependencies first
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;

-- -- Recreate orders table with simplified schema
-- CREATE TABLE orders (
--     id BIGSERIAL PRIMARY KEY,
--     user_id BIGINT NOT NULL REFERENCES users(id),
--     first_name VARCHAR(255) NOT NULL DEFAULT '',
--     last_name VARCHAR(255) NOT NULL DEFAULT '',
--     email VARCHAR(255) NOT NULL DEFAULT '',
--     address TEXT NOT NULL DEFAULT '',
--     total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
--     total_quantity INTEGER NOT NULL DEFAULT 0,
--     status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
--     order_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
--     created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
--     updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
-- );

-- -- Recreate order_items table
-- CREATE TABLE order_items (
--     id BIGSERIAL PRIMARY KEY,
--     order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
--     book_id BIGINT NOT NULL REFERENCES books(id),
--     title VARCHAR(255) NOT NULL,
--     price DECIMAL(10, 2) NOT NULL,
--     quantity INTEGER NOT NULL,
--     subtotal DECIMAL(10, 2) NOT NULL,
--     CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id),
--     CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id)
-- );

-- Modify foreign key constraints to support ON DELETE SET NULL

-- Simple approach for the orders table
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey,
ADD CONSTRAINT orders_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE SET NULL;

-- Ensure the column allows NULL values
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Simple approach for the carts table
ALTER TABLE carts 
DROP CONSTRAINT IF EXISTS carts_user_id_fkey,
ADD CONSTRAINT carts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE SET NULL;

-- Ensure the column allows NULL values
ALTER TABLE carts ALTER COLUMN user_id DROP NOT NULL; 