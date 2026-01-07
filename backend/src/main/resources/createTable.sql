-- Drop old table if it exists (optional but useful in dev)
DROP TABLE IF EXISTS products CASCADE;

-- Create products table with all columns
CREATE TABLE products (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255)      NOT NULL,
    description VARCHAR(500),
    price       NUMERIC(10, 2)    NOT NULL,
    image_url   VARCHAR(512),
    featured    BOOLEAN           NOT NULL DEFAULT FALSE,
    details     TEXT              -- new detailed info column
);
