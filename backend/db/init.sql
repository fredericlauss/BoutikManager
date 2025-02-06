-- Nous n'avons plus besoin de créer la base de données car elle est créée par Docker
-- Nous n'avons plus besoin de \c ecommerce car nous sommes déjà connectés à la bonne base

-- Création de la table products si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO product (name, description, price, stock, image_url) 
VALUES 
    ('Veste Imperméable', 'Veste imperméable tendance et confortable, parfaite pour toutes les saisons. Disponible en plusieurs coloris.', 99.99, 100, 'https://example.com/veste.jpg'),
    ('Veste Imperméable - Edition Limitée', 'Version exclusive de notre veste imperméable avec finitions premium et design unique.', 149.99, 50, 'https://example.com/veste-limited.jpg'); 