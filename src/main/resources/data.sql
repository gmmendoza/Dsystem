-- Insertar Alumnos (15 de prueba)
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Juan', 'Pérez', '11111111', 'juan.perez@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('María', 'García', '22222222', 'maria.garcia@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Carlos', 'Sánchez', '33333333', 'carlos.sanchez@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Ana', 'Martínez', '44444444', 'ana.martinez@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Luis', 'Rodríguez', '55555555', 'luis.rodriguez@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Elena', 'Gómez', '66666666', 'elena.gomez@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Pedro', 'López', '77777777', 'pedro.lopez@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Sofía', 'Fernández', '88888888', 'sofia.fernandez@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Diego', 'González', '99999999', 'diego.gonzalez@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Lucía', 'Díaz', '10101010', 'lucia.diaz@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Andrés', 'Silva', '12121212', 'andres.silva@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Valeria', 'Rojas', '13131313', 'valeria.rojas@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Mateo', 'Castro', '14141414', 'mateo.castro@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Camila', 'Torres', '15151515', 'camila.torres@example.com') ON CONFLICT (dni) DO NOTHING;
INSERT INTO alumnos (nombre, apellido, dni, email) VALUES ('Bruno', 'Vargas', '16161616', 'bruno.vargas@example.com') ON CONFLICT (dni) DO NOTHING;

-- Insertar Cursos (2 de prueba)
INSERT INTO cursos (nombre, descripcion, nivel) VALUES ('Matemáticas I', 'Conceptos básicos de álgebra y geometría', 'Secundaria') ON CONFLICT DO NOTHING;
INSERT INTO cursos (nombre, descripcion, nivel) VALUES ('Literatura Universal', 'Historia de la literatura desde sus inicios', 'Pre-Grado') ON CONFLICT DO NOTHING;

-- Insertar Docente de ejemplo (si no existe para las planificaciones)
INSERT INTO docentes (nombre, apellido, email, especialidad) VALUES ('Profesor', 'Admin', 'admin@example.com', 'Ciencias Exactas') ON CONFLICT (email) DO NOTHING;

-- Insertar Planificaciones (3 de prueba)
-- Ajustado para referenciar al docente 1 (asumiendo IDs seriales)
INSERT INTO planificaciones (titulo, contenido, objetivos, fecha_inicio, fecha_fin, docente_id) VALUES 
('Álgebra básica', 'Suma y resta de polinomios', 'Resolver expresiones algebraicas simples', '2026-03-22', '2026-03-27', 1),
('Geometría Euclidiana', 'Ángulos y triángulos', 'Aprender propiedades de figuras planas', '2026-04-01', '2026-04-10', 1),
('Química Orgánica', 'Hidrocarburos aromáticos', 'Identificar estructuras moleculares', '2026-03-25', '2026-03-30', 1)
ON CONFLICT DO NOTHING;
