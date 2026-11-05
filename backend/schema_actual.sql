-- ============================================================
-- Schema actual de la base de datos 'mozzafiato'
-- (Post-migración: sin tabla 'novio' redundante)
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Tabla: persona
-- Contiene a todas las personas del sistema (novios, invitados, etc.)
-- --------------------------------------------------------
CREATE TABLE `persona` (
  `idPerso` int(11) NOT NULL AUTO_INCREMENT,
  `nombreApe` varchar(150) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `correoElect` varchar(100) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `rol` varchar(20) NOT NULL,
  PRIMARY KEY (`idPerso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabla: planner
-- --------------------------------------------------------
CREATE TABLE `planner` (
  `idPlanner` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  PRIMARY KEY (`idPlanner`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabla: servicios
-- --------------------------------------------------------
CREATE TABLE `servicios` (
  `idServicio` int(50) NOT NULL AUTO_INCREMENT,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `descripcion` varchar(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idServicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabla: boda
-- --------------------------------------------------------
CREATE TABLE `boda` (
  `idBoda` int(11) NOT NULL AUTO_INCREMENT,
  `fechaHoraPlanif` datetime NOT NULL,
  `presupuesto` decimal(12,2) NOT NULL,
  `seniaBoda` decimal(12,2) DEFAULT 0.00,
  `estadoBoda` varchar(30) NOT NULL,
  `idPlanner` int(11) NOT NULL,
  PRIMARY KEY (`idBoda`),
  KEY `idPlanner` (`idPlanner`),
  CONSTRAINT `boda_ibfk_1` FOREIGN KEY (`idPlanner`) REFERENCES `planner` (`idPlanner`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabla: boda_novio
-- Vincula directamente boda con persona (sin tabla 'novio' intermedia)
-- Cada boda tiene 2 filas: una por cada novio/a de la pareja
-- --------------------------------------------------------
CREATE TABLE `boda_novio` (
  `idBoda` int(11) NOT NULL,
  `idNovio` int(11) NOT NULL,
  PRIMARY KEY (`idBoda`, `idNovio`),
  KEY `idNovio` (`idNovio`),
  CONSTRAINT `boda_novio_boda_fk` FOREIGN KEY (`idBoda`) REFERENCES `boda` (`idBoda`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `boda_novio_persona_fk` FOREIGN KEY (`idNovio`) REFERENCES `persona` (`idPerso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabla: boda_servicios
-- --------------------------------------------------------
CREATE TABLE `boda_servicios` (
  `idServicios` int(11) NOT NULL,
  `idBoda` int(11) NOT NULL,
  PRIMARY KEY (`idServicios`, `idBoda`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabla: invitados
-- --------------------------------------------------------
CREATE TABLE `invitados` (
  `idInvi` int(11) NOT NULL,
  PRIMARY KEY (`idInvi`),
  CONSTRAINT `invitados_ibfk_1` FOREIGN KEY (`idInvi`) REFERENCES `persona` (`idPerso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
