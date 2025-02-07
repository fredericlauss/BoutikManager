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
    ('Veste Imperméable', 'Veste imperméable tendance et confortable, parfaite pour toutes les saisons. Disponible en plusieurs coloris.', 99.99, 100, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('Veste Imperméable - Edition Limitée', 'Version exclusive de notre veste imperméable avec finitions premium et design unique.', 149.99, 50, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('T-Shirt Basic - Stock Critique', 'T-shirt basique en coton bio, coupe classique.', 19.99, 1, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('Pantalon Cargo - Stock Faible', 'Pantalon cargo confortable avec multiples poches.', 59.99, 8, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('Pull-over Classique - Stock Moyen', 'Pull-over chaud et élégant pour l''hiver.', 79.99, 20, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('Chemise Business - Stock Limite', 'Chemise professionnelle en coton.', 69.99, 10, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('Écharpe Hiver - Dernier Stock', 'Écharpe chaude et douce.', 29.99, 2, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('Bonnet Laine - Presque Épuisé', 'Bonnet en laine mérinos.', 24.99, 30, 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'),
    ('Gants Tactiles - Stock Bas', 'Gants compatibles écran tactile.', 34.99, 50, 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'),
    ('Ceinture Cuir - Dernières Pièces', 'Ceinture en cuir véritable.', 44.99, 60, 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg'); 