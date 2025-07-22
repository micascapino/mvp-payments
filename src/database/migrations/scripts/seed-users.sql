-- Insert users with balance 100,000 (IDs 3-5)
INSERT INTO users (id, name, email, balance, created_at, updated_at)
VALUES 
    (1, 'Micaela Scapino', 'micascapino@example.com', 100000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Pedro', 'pedro@example.com', 100000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Pepe', 'pepe@example.com', 100000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Martín', 'martin@example.com', 100000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'Fulano', 'fulano@example.com', 100000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert users with balance 10,000 (IDs 6-10)
INSERT INTO users (id, name, email, balance, created_at, updated_at)
VALUES 
    (6, 'Mengano', 'mengano@example.com', 10000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, 'Juan', 'juan@example.com', 10000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8, 'Pedro', 'pedro@example.com', 10000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9, 'María', 'maria@example.com', 10000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 'Ana', 'ana@example.com', 10000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert users with balance 0 (IDs 11-15)
INSERT INTO users (id, name, email, balance, created_at, updated_at)
VALUES 
    (11, 'Carlos', 'carlos@example.com', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (12, 'Laura', 'laura@example.com', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (13, 'Roberto', 'roberto@example.com', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (14, 'Sofía', 'sofia@example.com', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (15, 'Lucas', 'lucas@example.com', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 