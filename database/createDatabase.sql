DROP DATABASE IF EXISTS `desarrollos-palo-blanco`;
CREATE DATABASE IF NOT EXISTS `desarrollos-palo-blanco`;

USE `desarrollos-palo-blanco`;


CREATE TABLE IF NOT EXISTS categoria_inversion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS inversionista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    inversion DECIMAL(12,2) DEFAULT 0.00,
    categoria_id INT,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria_inversion(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- Insertar categorías iniciales
INSERT INTO categoria_inversion (nombre, descripcion) VALUES
('Bajo Riesgo', 'Inversiones seguras con bajo rendimiento'),
('Riesgo Moderado', 'Balance entre riesgo y rendimiento'),
('Alto Riesgo', 'Alta volatilidad con posibilidad de alto retorno'),
('Inmobiliaria', 'Inversiones en bienes raíces'),
('Tecnología', 'Inversiones en startups o empresas tecnológicas');