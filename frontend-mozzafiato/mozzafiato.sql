-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-11-2026 a las 01:40:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mozzafiato`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boda`
--

CREATE TABLE `boda` (
  `idBoda` int(11) NOT NULL,
  `fechaHoraPlanif` datetime NOT NULL,
  `presupuesto` decimal(12,2) NOT NULL,
  `seniaBoda` decimal(12,2) DEFAULT 0.00,
  `estadoBoda` varchar(30) NOT NULL,
  `idPlanner` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boda`
--

INSERT INTO `boda` (`idBoda`, `fechaHoraPlanif`, `presupuesto`, `seniaBoda`, `estadoBoda`, `idPlanner`) VALUES
(16, '2026-12-21 00:00:00', 60000.00, 10000.00, 'Planificada', 2),
(17, '2039-03-15 20:00:00', 300000.00, 10.00, 'Planificada', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boda_invitados`
--

CREATE TABLE `boda_invitados` (
  `idBodaInvitado` int(11) NOT NULL,
  `idBoda` int(11) NOT NULL,
  `idPerso` int(11) NOT NULL,
  `invitacionEnviada` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boda_novio`
--

CREATE TABLE `boda_novio` (
  `idBoda` int(11) NOT NULL,
  `idNovio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boda_novio`
--

INSERT INTO `boda_novio` (`idBoda`, `idNovio`) VALUES
(16, 6),
(16, 18),
(17, 6),
(17, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boda_servicios`
--

CREATE TABLE `boda_servicios` (
  `idServicios` int(11) NOT NULL,
  `idBoda` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boda_servicios`
--

INSERT INTO `boda_servicios` (`idServicios`, `idBoda`) VALUES
(2, 12),
(1, 12),
(1, 14),
(2, 14),
(1, 16),
(1, 17),
(4, 17),
(5, 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invitados`
--

CREATE TABLE `invitados` (
  `idInvi` int(11) NOT NULL,
  `fechaNac` date DEFAULT NULL,
  `estado` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `idPerso` int(11) NOT NULL,
  `nombreApe` varchar(150) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `correoElect` varchar(100) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `rol` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`idPerso`, `nombreApe`, `telefono`, `correoElect`, `observacion`, `rol`) VALUES
(6, 'Geraldine S', '3401653728', 'geri@gmail.com', 'carnivora', 'Novio'),
(12, 'Pamela ', '3401522557', 'pameterreno@hotmail.com', '-', 'Invitado'),
(15, 'asdraaa', '21827741672', 'gerisedlar15@gmail.com', 'veganito', 'Invitado'),
(16, 'lolhgfgt', '123456', 'gerisedlar15@gmail.com', 'veganito', 'Invitado'),
(18, 'Angelo', '3402656478', 'gerisedlar15@gmail.com', 'veganito', 'Novio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planner`
--

CREATE TABLE `planner` (
  `idPlanner` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contrasenia` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planner`
--

INSERT INTO `planner` (`idPlanner`, `nombre`, `usuario`, `contrasenia`) VALUES
(2, 'Geraldine Sedra', 'admin', '1234'),
(3, 'Lourdes Ose', '', ''),
(14, 'marcela', 'marcelita1234', '1234'),
(15, 'marcela', 'marcelongui1234', '124'),
(16, 'marcel', 'kWFJAS', 'JSBAJBF'),
(18, 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaa', 'dd'),
(21, 'locurita', 'mix123', '12345');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `idServicio` int(50) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `descripcion` varchar(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `precio` decimal(12,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`idServicio`, `telefono`, `email`, `descripcion`, `nombre`, `precio`) VALUES
(1, '3401653076', 'bebida@gmail.com', 'Barra libre', 'Bebidas Premium', 15000.00),
(4, '3401643052', 'fotos@gmail.com', 'Fotografia en hd', 'fotografia', 25000.00),
(5, '341-456789', 'catering@mail.com', 'Menú gourmet complet', 'Catering Gourmet', 15000.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `boda`
--
ALTER TABLE `boda`
  ADD PRIMARY KEY (`idBoda`),
  ADD KEY `idPlanner` (`idPlanner`);

--
-- Indices de la tabla `boda_invitados`
--
ALTER TABLE `boda_invitados`
  ADD PRIMARY KEY (`idBodaInvitado`),
  ADD UNIQUE KEY `unique_boda_persona` (`idBoda`,`idPerso`),
  ADD KEY `idPerso` (`idPerso`);

--
-- Indices de la tabla `boda_novio`
--
ALTER TABLE `boda_novio`
  ADD PRIMARY KEY (`idBoda`,`idNovio`),
  ADD KEY `boda_novio_persona_fk` (`idNovio`);

--
-- Indices de la tabla `invitados`
--
ALTER TABLE `invitados`
  ADD PRIMARY KEY (`idInvi`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`idPerso`);

--
-- Indices de la tabla `planner`
--
ALTER TABLE `planner`
  ADD PRIMARY KEY (`idPlanner`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`idServicio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `boda`
--
ALTER TABLE `boda`
  MODIFY `idBoda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `boda_invitados`
--
ALTER TABLE `boda_invitados`
  MODIFY `idBodaInvitado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `idPerso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `planner`
--
ALTER TABLE `planner`
  MODIFY `idPlanner` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `idServicio` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `boda`
--
ALTER TABLE `boda`
  ADD CONSTRAINT `boda_ibfk_1` FOREIGN KEY (`idPlanner`) REFERENCES `planner` (`idPlanner`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `boda_invitados`
--
ALTER TABLE `boda_invitados`
  ADD CONSTRAINT `boda_invitados_ibfk_1` FOREIGN KEY (`idBoda`) REFERENCES `boda` (`idBoda`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `boda_invitados_ibfk_2` FOREIGN KEY (`idPerso`) REFERENCES `persona` (`idPerso`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `boda_novio`
--
ALTER TABLE `boda_novio`
  ADD CONSTRAINT `boda_novio_ibfk_1` FOREIGN KEY (`idBoda`) REFERENCES `boda` (`idBoda`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `boda_novio_persona_fk` FOREIGN KEY (`idNovio`) REFERENCES `persona` (`idPerso`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `invitados`
--
ALTER TABLE `invitados`
  ADD CONSTRAINT `invitados_ibfk_1` FOREIGN KEY (`idInvi`) REFERENCES `persona` (`idPerso`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
