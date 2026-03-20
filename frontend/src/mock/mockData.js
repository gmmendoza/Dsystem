export const initialAlumnos = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '11111111', email: 'juan.perez@example.com' },
  { id: 2, nombre: 'María', apellido: 'García', dni: '22222222', email: 'maria.garcia@example.com' },
  { id: 3, nombre: 'Carlos', apellido: 'Sánchez', dni: '33333333', email: 'carlos.sanchez@example.com' },
  { id: 4, nombre: 'Ana', apellido: 'Martínez', dni: '44444444', email: 'ana.martinez@example.com' },
  { id: 5, nombre: 'Luis', apellido: 'Rodríguez', dni: '55555555', email: 'luis.rodriguez@example.com' },
  { id: 6, nombre: 'Elena', apellido: 'Gómez', dni: '66666666', email: 'elena.gomez@example.com' },
  { id: 7, nombre: 'Pedro', apellido: 'López', dni: '77777777', email: 'pedro.lopez@example.com' },
  { id: 8, nombre: 'Sofía', apellido: 'Fernández', dni: '88888888', email: 'sofia.fernandez@example.com' },
  { id: 9, nombre: 'Diego', apellido: 'González', dni: '99999999', email: 'diego.gonzalez@example.com' },
  { id: 10, nombre: 'Lucía', apellido: 'Díaz', dni: '10101010', email: 'lucia.diaz@example.com' },
  { id: 11, nombre: 'Andrés', apellido: 'Silva', dni: '12121212', email: 'andres.silva@example.com' },
  { id: 12, nombre: 'Valeria', apellido: 'Rojas', dni: '13131313', email: 'valeria.rojas@example.com' },
  { id: 13, nombre: 'Mateo', apellido: 'Castro', dni: '14141414', email: 'mateo.castro@example.com' },
  { id: 14, nombre: 'Camila', apellido: 'Torres', dni: '15151515', email: 'camila.torres@example.com' },
  { id: 15, nombre: 'Bruno', apellido: 'Vargas', dni: '16161616', email: 'bruno.vargas@example.com' },
];

export const initialCursos = [
  { id: 1, nombre: 'Matemáticas I', descripcion: 'Álgebra y geometría básica', nivel: 'Secundaria', alumnos: [1, 2, 3, 4, 5] },
  { id: 2, nombre: 'Literatura Universal', descripcion: 'Historia de las letras', nivel: 'Pre-Grado', alumnos: [6, 7, 8] },
];

export const initialPlanificaciones = [
  { id: 1, titulo: 'Álgebra básica', contenido: 'Polinomios', objetivos: 'Suma/Resta', fechaInicio: '2026-03-22', fechaFin: '2026-03-27', docenteId: 1 },
  { id: 2, titulo: 'Geometría Euclidiana', contenido: 'Triángulos', objetivos: 'Propiedades', fechaInicio: '2026-04-01', fechaFin: '2026-04-10', docenteId: 1 },
  { id: 3, titulo: 'Química Orgánica', contenido: 'Compuestos', objetivos: 'Estructuras', fechaInicio: '2026-03-25', fechaFin: '2026-03-30', docenteId: 1 },
];
