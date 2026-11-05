-- ============================================================
-- Migración: Eliminar tabla redundante 'novio'
-- La FK de boda_novio.idNovio pasa de apuntar a 'novio'
-- a apuntar directamente a 'persona'.
-- ============================================================

-- 1. Quitar la FK de boda_novio que apunta a novio
ALTER TABLE `boda_novio` DROP FOREIGN KEY `boda_novio_ibfk_2`;

-- 2. Crear nueva FK de boda_novio.idNovio apuntando a persona.idPerso
ALTER TABLE `boda_novio`
  ADD CONSTRAINT `boda_novio_persona_fk`
  FOREIGN KEY (`idNovio`) REFERENCES `persona` (`idPerso`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Eliminar la tabla novio (ya no se necesita)
DROP TABLE IF EXISTS `novio`;
