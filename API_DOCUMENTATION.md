# 📡 Documentación de la API

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:

```
Authorization: Bearer {token}
```

---

## 📋 Endpoints

### Auth

#### POST `/auth/login`
Iniciar sesión

**Body:**
```json
{
  "usuario": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "apellidos": "Sistema",
    "usuario": "admin",
    "rol": "admin"
  }
}
```

#### GET `/auth/verify`
Verificar token (requiere autenticación)

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### Administradores (requiere rol: admin)

#### GET `/admin`
Listar todos los administradores

#### GET `/admin/profile`
Obtener perfil del admin actual

#### PUT `/admin/profile`
Actualizar perfil del admin actual

**Body:**
```json
{
  "nombre": "Nuevo Nombre",
  "apellidos": "Nuevos Apellidos",
  "email": "nuevo@email.com",
  "telefono": "999888777",
  "password": "nueva_contraseña" // opcional
}
```

#### POST `/admin`
Crear nuevo administrador

**Body:**
```json
{
  "nombre": "Juan",
  "apellidos": "Pérez",
  "usuario": "jperez",
  "password": "contraseña123",
  "email": "juan@email.com",
  "telefono": "987654321"
}
```

#### PUT `/admin/:id`
Actualizar administrador

#### DELETE `/admin/:id`
Eliminar administrador

---

### Practicantes

#### GET `/practicantes` (admin)
Listar todos los practicantes

#### GET `/practicantes/:id` (admin)
Obtener practicante por ID

#### GET `/practicantes/codigo/:codigo` (admin)
Buscar practicante por código QR

#### POST `/practicantes` (admin)
Crear nuevo practicante

**Body:**
```json
{
  "nombre": "María",
  "apellidos": "García",
  "documento": "72345678",
  "telefono": "987654321",
  "codigo": "PRACT-004",
  "email": "maria@ucv.edu.pe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Practicante creado correctamente",
  "data": {
    "id": 4,
    "usuario": "PRACT-004",
    "password_default": "123456"
  }
}
```

#### PUT `/practicantes/:id` (admin)
Actualizar practicante

#### DELETE `/practicantes/:id` (admin)
Eliminar practicante

#### GET `/practicantes/me` (practicante)
Obtener perfil del practicante actual

#### PUT `/practicantes/me` (practicante)
Actualizar perfil del practicante actual

---

### Asistencias

#### POST `/asistencias` (admin)
Registrar asistencia

**Body:**
```json
{
  "codigo": "PRACT-001",
  "tipo": "entrada" // o "salida"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Entrada registrada correctamente",
  "data": {
    "id": 15,
    "practicante": "Juan Carlos Pérez García",
    "codigo": "PRACT-001",
    "fecha": "2024-11-03",
    "hora": "08:15:30",
    "tipo": "entrada",
    "es_tardanza": true,
    "es_salida_temprana": false
  }
}
```

#### GET `/asistencias` (admin)
Listar asistencias con filtros opcionales

**Query params:**
- `fecha`: Filtrar por fecha (YYYY-MM-DD)
- `practicante_id`: Filtrar por practicante
- `tipo`: Filtrar por tipo (entrada/salida)

#### GET `/asistencias/hoy` (admin)
Obtener asistencias del día actual

#### GET `/asistencias/mi-historial` (practicante)
Obtener historial del practicante actual

**Response:**
```json
{
  "success": true,
  "data": {
    "asistencias": [...],
    "estadisticas": {
      "total_asistencias": 15,
      "total_tardanzas": 3,
      "total_salidas_tempranas": 1
    }
  }
}
```

#### GET `/asistencias/practicante/:id` (admin)
Obtener historial de un practicante específico

#### DELETE `/asistencias/:id` (admin)
Eliminar registro de asistencia

---

### Reportes (admin)

#### GET `/reportes/dashboard`
Estadísticas del dashboard

**Response:**
```json
{
  "success": true,
  "data": {
    "total_practicantes": 25,
    "asistencias_hoy": 18,
    "tardanzas_hoy": 3,
    "salidas_tempranas_hoy": 1
  }
}
```

#### GET `/reportes/tardanzas`
Reporte de tardanzas

**Query params:**
- `fecha_inicio`: Fecha inicial (YYYY-MM-DD)
- `fecha_fin`: Fecha final (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "tardanzas": [...],
    "resumen": [
      {
        "id": 1,
        "codigo": "PRACT-001",
        "nombre_completo": "Juan Pérez",
        "total_tardanzas": 5
      }
    ]
  }
}
```

#### GET `/reportes/salidas-tempranas`
Reporte de salidas tempranas

**Query params:**
- `fecha_inicio`: Fecha inicial
- `fecha_fin`: Fecha final

#### GET `/reportes/general`
Reporte general de asistencias

**Query params:**
- `fecha_inicio`: Fecha inicial
- `fecha_fin`: Fecha final

#### GET `/reportes/mis-estadisticas` (practicante)
Estadísticas del practicante actual

#### GET `/reportes/practicante/:id` (admin)
Estadísticas de un practicante específico

---

## 🔒 Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (token inválido o expirado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Formato de Respuesta

### Éxito
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

---

## 🛡️ Reglas de Negocio

1. **Tardanza:** Se marca cuando la entrada es después de las 8:00 AM
2. **Salida Temprana:** Se marca cuando la salida es antes de la 1:00 PM
3. **Duplicados:** No se puede marcar dos veces el mismo tipo en un día
4. **Códigos únicos:** Cada practicante tiene un código QR único
5. **Contraseñas:** Se encriptan con bcrypt (salt rounds: 10)
6. **Tokens JWT:** Expiran en 24 horas

---

## 🔧 Variables de Entorno

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=asistencia_qr
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_super_segura

# Horarios
HORA_ENTRADA=08:00:00
HORA_SALIDA=13:00:00
```

---

## 🧪 Ejemplos de Uso con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"admin123"}'
```

### Registrar Asistencia
```bash
curl -X POST http://localhost:3000/api/asistencias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"codigo":"PRACT-001","tipo":"entrada"}'
```

### Listar Practicantes
```bash
curl -X GET http://localhost:3000/api/practicantes \
  -H "Authorization: Bearer {token}"
```

---

## 📊 Estructura de Datos

### Usuario (Admin/Practicante)
```typescript
{
  id: number
  nombre: string
  apellidos: string
  usuario: string
  email?: string
  telefono?: string
  foto?: string
  activo: boolean
  rol: 'admin' | 'practicante'
  codigo?: string // solo practicantes
  documento?: string // solo practicantes
}
```

### Asistencia
```typescript
{
  id: number
  practicante_id: number
  fecha: string // YYYY-MM-DD
  hora: string // HH:MM:SS
  tipo: 'entrada' | 'salida'
  es_tardanza: boolean
  es_salida_temprana: boolean
  registrado_por: number // ID del admin
}
```

---

## 🚀 Extensiones Futuras

El sistema está preparado para:
- Exportación de reportes a Excel/PDF
- Notificaciones por email
- Dashboard con gráficos
- Aplicación móvil
- Reconocimiento facial
- Integración con otros sistemas

---

**Desarrollado para Municipalidad de Piura**
