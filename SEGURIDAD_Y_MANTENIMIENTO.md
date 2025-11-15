# 🔒 Seguridad y Mantenimiento del Sistema

## 🛡️ Guía de Seguridad

### 1. Contraseñas

#### ⚠️ IMPORTANTE - Cambiar Contraseñas por Defecto
Antes de usar el sistema en producción:

```bash
# Contraseñas por defecto que DEBES cambiar:
Admin: admin / admin123
Practicantes: PRACT-XXX / 123456
```

#### ✅ Buenas Prácticas de Contraseñas
- Mínimo 8 caracteres
- Combinar mayúsculas, minúsculas, números y símbolos
- No usar información personal
- Cambiar cada 3 meses
- No compartir contraseñas

#### Cambiar Contraseña del Admin Principal
1. Inicia sesión como admin
2. Ve a tu perfil
3. Ingresa nueva contraseña
4. Guarda cambios

### 2. JWT Secret

#### ⚠️ CRÍTICO - Cambiar JWT_SECRET en Producción

Edita `backend/.env`:
```env
# NO USAR ESTE EN PRODUCCIÓN
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion_2024

# Genera uno nuevo con:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Base de Datos

#### Seguridad de MySQL
```sql
-- Crear usuario específico para la aplicación
CREATE USER 'asistencia_user'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT ALL PRIVILEGES ON asistencia_qr.* TO 'asistencia_user'@'localhost';
FLUSH PRIVILEGES;
```

Actualiza `backend/.env`:
```env
DB_USER=asistencia_user
DB_PASSWORD=contraseña_segura
```

#### Backup de Base de Datos

**Backup Manual:**
```bash
# Exportar
mysqldump -u root -p asistencia_qr > backup_$(date +%Y%m%d).sql

# Importar
mysql -u root -p asistencia_qr < backup_20241103.sql
```

**Backup Automático (Windows):**
Crea un archivo `backup.bat`:
```batch
@echo off
set fecha=%date:~-4%%date:~3,2%%date:~0,2%
mysqldump -u root -p asistencia_qr > backups\backup_%fecha%.sql
```

Programa en el Programador de Tareas de Windows para ejecutar diariamente.

### 4. HTTPS en Producción

⚠️ **NUNCA uses HTTP en producción**

Opciones:
- Usar un certificado SSL (Let's Encrypt gratis)
- Configurar un proxy inverso (nginx, Apache)
- Usar servicios cloud con SSL incluido

### 5. Variables de Entorno

❌ **NUNCA subas archivos .env a Git**

El `.gitignore` ya está configurado, pero verifica:
```
.env
.env.local
.env.production
```

### 6. Validación de Datos

El sistema ya incluye:
- ✅ Validación en frontend
- ✅ Validación en backend
- ✅ Sanitización de inputs
- ✅ Prevención de SQL injection
- ✅ Prevención de XSS

### 7. Roles y Permisos

Verifica que:
- Solo admins puedan crear/editar/eliminar
- Practicantes solo vean su información
- Tokens expiren correctamente (24h)

---

## 🔧 Mantenimiento Regular

### Diario

#### ✅ Checklist Diario
- [ ] Verificar que backend esté corriendo
- [ ] Verificar que frontend esté corriendo
- [ ] Verificar que MySQL esté activo
- [ ] Revisar asistencias del día
- [ ] Verificar que la cámara funcione

### Semanal

#### ✅ Checklist Semanal
- [ ] Backup de base de datos
- [ ] Revisar logs de errores
- [ ] Generar reportes semanales
- [ ] Verificar espacio en disco
- [ ] Limpiar logs antiguos

### Mensual

#### ✅ Checklist Mensual
- [ ] Backup completo del sistema
- [ ] Revisar usuarios inactivos
- [ ] Actualizar dependencias (si hay actualizaciones de seguridad)
- [ ] Revisar rendimiento del sistema
- [ ] Generar reportes mensuales

### Trimestral

#### ✅ Checklist Trimestral
- [ ] Cambiar contraseñas críticas
- [ ] Auditoría de seguridad
- [ ] Limpieza de datos antiguos (opcional)
- [ ] Revisar y actualizar documentación

---

## 📊 Monitoreo del Sistema

### Logs del Backend

Ubicación: Terminal donde corre el backend

Buscar:
- ❌ Errores de conexión a BD
- ❌ Tokens inválidos frecuentes
- ❌ Intentos de acceso no autorizado
- ✅ Conexiones exitosas

### Logs del Frontend

Ubicación: Consola del navegador (F12)

Buscar:
- ❌ Errores de red
- ❌ Errores de componentes
- ❌ Warnings de React

### Base de Datos

Monitorear:
- Tamaño de la base de datos
- Número de registros
- Consultas lentas
- Conexiones activas

```sql
-- Ver tamaño de la BD
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'asistencia_qr'
GROUP BY table_schema;

-- Contar registros
SELECT 
    'Practicantes' as tabla, COUNT(*) as total FROM practicantes
UNION ALL
SELECT 'Asistencias', COUNT(*) FROM asistencias
UNION ALL
SELECT 'Administradores', COUNT(*) FROM administradores;
```

---

## 🚨 Solución de Problemas

### Sistema Lento

**Causas posibles:**
1. Muchos registros en la BD
2. Conexión a internet lenta
3. Servidor sobrecargado

**Soluciones:**
```sql
-- Optimizar tablas
OPTIMIZE TABLE asistencias;
OPTIMIZE TABLE practicantes;

-- Limpiar datos antiguos (opcional, después de 1 año)
DELETE FROM asistencias WHERE fecha < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### Errores de Conexión a BD

**Verificar:**
1. MySQL está corriendo
2. Credenciales en `.env` son correctas
3. Base de datos existe
4. Usuario tiene permisos

### Tokens Expirados Frecuentemente

**Solución:**
Aumentar tiempo de expiración en `backend/controllers/authController.js`:
```javascript
const token = jwt.sign(
  { ... },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // Cambiar de '24h' a '7d'
);
```

### Cámara No Funciona

**Verificar:**
1. Permisos de cámara en el navegador
2. Usar HTTPS o localhost
3. Cámara no está en uso por otra app
4. Drivers de cámara actualizados

---

## 🔄 Actualización del Sistema

### Actualizar Dependencias

**Backend:**
```bash
cd backend
npm outdated  # Ver paquetes desactualizados
npm update    # Actualizar (cuidado con breaking changes)
```

**Frontend:**
```bash
cd frontend
npm outdated
npm update
```

⚠️ **Siempre haz backup antes de actualizar**

### Actualizar Node.js

1. Descargar versión LTS de nodejs.org
2. Instalar
3. Verificar: `node --version`
4. Reinstalar dependencias: `npm install`

---

## 📋 Checklist de Producción

Antes de poner el sistema en producción:

### Seguridad
- [ ] Cambiar contraseña de admin
- [ ] Cambiar JWT_SECRET
- [ ] Configurar usuario de BD específico
- [ ] Habilitar HTTPS
- [ ] Configurar CORS correctamente
- [ ] Deshabilitar modo desarrollo

### Configuración
- [ ] Configurar backups automáticos
- [ ] Configurar monitoreo
- [ ] Documentar procedimientos
- [ ] Capacitar a usuarios
- [ ] Probar todos los flujos

### Rendimiento
- [ ] Optimizar base de datos
- [ ] Configurar caché (si aplica)
- [ ] Verificar velocidad de carga
- [ ] Probar con múltiples usuarios

---

## 🆘 Contactos de Emergencia

### Problemas Técnicos
- Administrador del Sistema: [contacto]
- Soporte Técnico: [contacto]

### Problemas de Base de Datos
- DBA: [contacto]

### Problemas de Red
- IT: [contacto]

---

## 📚 Recursos Adicionales

### Documentación Oficial
- Node.js: https://nodejs.org/docs
- React: https://react.dev
- Express: https://expressjs.com
- MySQL: https://dev.mysql.com/doc

### Herramientas Útiles
- phpMyAdmin: Gestión de BD
- Postman: Pruebas de API
- Chrome DevTools: Debug frontend

---

## 🔐 Política de Seguridad

### Reportar Vulnerabilidades
Si encuentras una vulnerabilidad de seguridad:
1. NO la publiques públicamente
2. Contacta al administrador del sistema
3. Proporciona detalles técnicos
4. Espera confirmación antes de divulgar

### Actualizaciones de Seguridad
- Revisar actualizaciones semanalmente
- Aplicar parches críticos inmediatamente
- Probar en ambiente de desarrollo primero

---

## ✅ Buenas Prácticas

1. **Backups regulares** - No esperes a perder datos
2. **Contraseñas fuertes** - La primera línea de defensa
3. **Monitoreo constante** - Detecta problemas temprano
4. **Documentación actualizada** - Facilita el mantenimiento
5. **Capacitación continua** - Usuarios informados = menos errores
6. **Pruebas regulares** - Verifica que todo funcione
7. **Plan de contingencia** - Prepárate para lo peor

---

**Mantén el sistema seguro y funcionando correctamente** 🛡️

**Sistema de Asistencia QR**  
Municipalidad de Piura
