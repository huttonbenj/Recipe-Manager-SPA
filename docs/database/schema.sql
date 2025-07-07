-- PostgreSQL DDL for Recipe Manager

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed script with sample recipes
INSERT INTO recipes (title, ingredients, instructions, image_url) VALUES
('Spaghetti Bolognese', 'Spaghetti, minced beef, tomato sauce', 'Cook spaghetti. Cook beef. Mix with sauce.', 'http://example.com/spaghetti.jpg'),
('Chicken Curry', 'Chicken, curry powder, coconut milk', 'Cook chicken. Add curry powder. Add coconut milk.', 'http://example.com/curry.jpg'),
('Beef Stew', 'Beef, potatoes, carrots, onions', 'Cook beef. Add vegetables. Simmer.', 'http://example.com/stew.jpg');