-- ===================================================================
-- LOCSERVICE - BANCO DE DADOS
-- Sistema de marketplace para prestadores de serviços em condomínios
-- ===================================================================

-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS locservice_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE locservice_db;

-- Deletar tabela se existir (para recriar)
DROP TABLE IF EXISTS usuarios;

-- ===================================================================
-- TABELA: usuarios
-- Armazena informações de empresas prestadoras de serviço e admin
-- ===================================================================
CREATE TABLE usuarios (
  -- Identificação
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Dados de Login
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  
  -- Dados da Empresa
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NULL,
  descricao TEXT NULL,
  whatsapp VARCHAR(20) NULL,
  
  -- Permissões
  is_admin BOOLEAN DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)