CREATE DATABASE clinicaesteticahappylife;

CREATE TABLE clientes(
    codcliente INT(10) AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    sobrenome VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    whatsapp INT(20) NOT NULL,
    cep INT(15) NOT NULL,
    logradouro VARCHAR(50) NOT NULL,
    bairro VARCHAR(30) NOT NULL,
    complemento VARCHAR(30) NOT NULL,
    cidade VARCHAR(30) NOT NULL,
    estado VARCHAR(30) NOT NULL
);

ALTER TABLE clientes
ADD COLUMN numero VARCHAR(30);