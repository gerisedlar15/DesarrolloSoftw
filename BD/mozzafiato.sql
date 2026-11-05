-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-11-2026 a las 02:26:21
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
(3, '2026-10-10 20:30:00', 6500000.00, 800000.00, 'Planificada', 2),
(5, '2026-07-09 00:00:00', 5000000.00, 10000.00, 'Planificada', 2),
(6, '2027-04-03 00:00:00', 7000.00, 79.00, 'Planificada', 2),
(7, '2026-09-28 21:23:00', 6777.00, 8887.00, 'Planificada', 2),
(8, '2026-09-28 21:39:00', 32.00, -5.00, 'Planificada', 2),
(9, '2026-09-28 21:46:00', 8.00, 9.00, 'Planificada', 2),
(10, '2026-09-29 21:46:00', 8888.00, 90000.00, 'Planificada', 2),
(11, '2026-09-29 21:46:00', 8888.00, 90000.00, 'Planificada', 2),
(12, '2026-09-03 22:06:00', 7777.00, 78787.00, 'Planificada', 2),
(13, '2026-10-04 16:35:00', 15000.00, 13400.00, 'Planificada', 2),
(14, '2026-10-04 16:36:00', 1200.00, 1300.00, 'Planificada', 2);

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
(11, 6),
(12, 6),
(13, 6),
(14, 6);

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
(2, 14);

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
-- Estructura de tabla para la tabla `novio`
--

CREATE TABLE `novio` (
  `idNovio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `novio`
--

INSERT INTO `novio` (`idNovio`) VALUES
(6);

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
(6, 'Geraldine', '3401653728', 'geri@gmail.com', 'carnivora', 'Novio'),
(12, 'Pamela ', '3401522557', 'pameterreno@hotmail.com', '-', 'Invitado'),
(15, 'asdraaa', '21827741672', 'gerisedlar15@gmail.com', 'veganito', 'Invitado'),
(16, 'lolhgfgt', '123456', 'gerisedlar15@gmail.com', 'veganito', 'Invitado'),
(17, 'lola', '3827182184', 'gerisedlar15@gmail.com', 'sadas', 'Novio');

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
(2, 'Geraldine S', 'admin', '1234'),
(3, 'Lourdes Ose', '', ''),
(14, 'marcela', 'marcelita1234', '1234'),
(15, 'marcela', 'marcelongui1234', '124'),
(16, 'marcel', 'kWFJAS', 'JSBAJBF'),
(18, 'aaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaa', 'dd'),
(21, 'locurita', 'mix123', '12345'),
(22, 'delfi', 'delfinita', '123456');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `idServicio` int(50) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `descripcion` varchar(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`idServicio`, `telefono`, `email`, `descripcion`, `nombre`) VALUES
(1, '3401653076', 'bebidad@gmail.com', 'cocaaaaaaaaaaaa', 'Bebida'),
(2, '3827182184', 'gerisedlar15@gmail.c', 'ggfgfg', 'nmasnma'),
(3, '123456', 'gerisedlar15@gmail.c', 'sanguchito', 'catering de comida');

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
-- Indices de la tabla `boda_novio`
--
ALTER TABLE `boda_novio`
  ADD PRIMARY KEY (`idBoda`,`idNovio`),
  ADD KEY `idNovio` (`idNovio`);

--
-- Indices de la tabla `invitados`
--
ALTER TABLE `invitados`
  ADD PRIMARY KEY (`idInvi`);

--
-- Indices de la tabla `novio`
--
ALTER TABLE `novio`
  ADD PRIMARY KEY (`idNovio`);

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
  MODIFY `idBoda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `idPerso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `planner`
--
ALTER TABLE `planner`
  MODIFY `idPlanner` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `idServicio` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `boda`
--
ALTER TABLE `boda`
  ADD CONSTRAINT `boda_ibfk_1` FOREIGN KEY (`idPlanner`) REFERENCES `planner` (`idPlanner`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `boda_novio`
--
ALTER TABLE `boda_novio`
  ADD CONSTRAINT `boda_novio_ibfk_1` FOREIGN KEY (`idBoda`) REFERENCES `boda` (`idBoda`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `boda_novio_ibfk_2` FOREIGN KEY (`idNovio`) REFERENCES `novio` (`idNovio`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `invitados`
--
ALTER TABLE `invitados`
  ADD CONSTRAINT `invitados_ibfk_1` FOREIGN KEY (`idInvi`) REFERENCES `persona` (`idPerso`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `novio`
--
ALTER TABLE `novio`
  ADD CONSTRAINT `novio_ibfk_1` FOREIGN KEY (`idNovio`) REFERENCES `persona` (`idPerso`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
