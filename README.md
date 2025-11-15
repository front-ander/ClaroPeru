# 🏛️ Sistema de Asistencia por QR - Municipalidad de Piura

<div align="center">

**Sistema digital de registro de asistencia mediante códigos QR**  
*Desarrollado para practicantes de la Universidad César Vallejo (UCV)*

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green?logo=node.js)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)](https://www.mysql.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| **[🚀 INICIO_RAPIDO.md](INICIO_RAPIDO.md)** | Configuración en 3 pasos (5 minutos) |
| **[📖 INSTALACION.md](INSTALACION.md)** | Guía de instalación detallada paso a paso |
| **[📋 RESUMEN.md](RESUMEN.md)** | Resumen completo del proyecto y funcionalidades |
| **[📡 API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Documentación de endpoints de la API REST |
| **[❓ FAQ.md](FAQ.md)** | Preguntas frecuentes y soluciones |
| **[🔒 SEGURIDAD_Y_MANTENIMIENTO.md](SEGURIDAD_Y_MANTENIMIENTO.md)** | Guía de seguridad y mantenimiento |
| **[📝 CHANGELOG.md](CHANGELOG.md)** | Historial de cambios y versiones |

---

## ⚡ Inicio Rápido

### 1️⃣ Base de Datos
```bash
# Importar database.sql en phpMyAdmin
# http://localhost/phpmyadmin
```

### 2️⃣ Backend
```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend
```bash
cd frontend
npm install
npm run dev
```

### 🌐 Acceder
Abre tu navegador en: **http://localhost:5173**

---

## 🎯 Características Principales

<table>
<tr>
<td width="50%">

### 👨‍💼 Panel Administrador
- ✅ Dashboard con estadísticas en tiempo real
- ✅ CRUD completo de practicantes
- ✅ CRUD completo de administradores
- ✅ **Escáner QR integrado** con cámara
- ✅ Registro automático de entrada/salida
- ✅ Detección de tardanzas (>8:00 AM)
- ✅ Detección de salidas tempranas (<1:00 PM)
- ✅ Reportes detallados con filtros
- ✅ Búsqueda y filtros avanzados

</td>
<td width="50%">

### 👨‍🎓 Panel Practicante
- ✅ Código QR personal único
- ✅ Descarga de QR en PNG
- ✅ Perfil editable
- ✅ Historial completo de asistencias
- ✅ Estadísticas personales:
  - Total de asistencias
  - Total de tardanzas
  - Total de salidas tempranas
- ✅ Interfaz intuitiva y responsive

</td>
</tr>
</table>

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + Vite - Framework moderno y rápido
- **TailwindCSS** - Estilos utility-first
- **React Router DOM** - Navegación SPA
- **Axios** - Cliente HTTP
- **qrcode.react** - Generación de códigos QR
- **html5-qrcode** - Escaneo de códigos QR
- **Lucide React** - Iconos modernos

### Backend
- **Node.js** + Express - Servidor API REST
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación segura
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Control de acceso

---

## 👥 Usuarios de Prueba

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| 👨‍💼 **Administrador** | `admin` | `admin123` |
| 👨‍🎓 **Practicante 1** | `PRACT-001` | `123456` |
| 👨‍🎓 **Practicante 2** | `PRACT-002` | `123456` |
| 👨‍🎓 **Practicante 3** | `PRACT-003` | `123456` |

---

## ⏰ Configuración de Horarios

| Concepto | Horario |
|----------|---------|
| 🕐 **Entrada** | 8:00 AM |
| 🕐 **Salida** | 1:00 PM |
| ⏱️ **Duración** | 5 horas |

**Reglas:**
- ⚠️ **Tardanza:** Entrada después de las 8:00 AM
- ⚠️ **Salida Temprana:** Salida antes de la 1:00 PM

---

## 📱 Flujo de Uso

### Como Administrador:
1. 🔐 Inicia sesión con credenciales de admin
2. 📊 Revisa el dashboard con estadísticas del día
3. 👥 Gestiona practicantes (crear, editar, eliminar)
4. 📸 Escanea códigos QR para registrar asistencias
5. 📈 Genera reportes de tardanzas y salidas tempranas

### Como Practicante:
1. 🔐 Inicia sesión con tu código de practicante
2. 📱 Descarga tu código QR personal
3. 🎯 Muestra el QR al administrador para marcar
4. 📊 Revisa tu historial y estadísticas
5. ✏️ Actualiza tu perfil cuando sea necesario

---

## 🔒 Seguridad

- ✅ Autenticación JWT con tokens de 24 horas
- ✅ Contraseñas encriptadas con bcrypt (salt rounds: 10)
- ✅ Validación de roles (admin/practicante)
- ✅ Rutas protegidas con middleware
- ✅ Validación de datos en frontend y backend
- ✅ Prevención de SQL injection
- ✅ Prevención de XSS

---

## 📊 Estructura del Proyecto

```
sistema-de-verificacion-qr/
├── 📁 backend/              # API REST con Node.js + Express
│   ├── config/             # Configuración de BD
│   ├── controllers/        # Lógica de negocio
│   ├── middleware/         # Autenticación y validación
│   ├── routes/             # Rutas de la API
│   └── server.js           # Servidor principal
│
├── 📁 frontend/            # Aplicación React + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── context/       # Context API (Auth)
│   │   ├── pages/         # Páginas del sistema
│   │   ├── services/      # Llamadas a la API
│   │   └── App.jsx        # Configuración de rutas
│   └── package.json
│
├── 📄 database.sql         # Script SQL completo
├── 📄 README.md           # Este archivo
├── 📄 INSTALACION.md      # Guía de instalación
├── 📄 INICIO_RAPIDO.md    # Inicio en 3 pasos
├── 📄 API_DOCUMENTATION.md # Documentación de API
├── 📄 FAQ.md              # Preguntas frecuentes
└── 📄 RESUMEN.md          # Resumen del proyecto
```

---

## 🚀 Scripts de Inicio Rápido

### Windows
```bash
# Iniciar Backend
.\iniciar-backend.bat

# Iniciar Frontend (en otra terminal)
.\iniciar-frontend.bat
```

### Linux/Mac
```bash
# Backend
cd backend && npm run dev

# Frontend (en otra terminal)
cd frontend && npm run dev
```

---

## 🌐 URLs del Sistema

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🌐 **Frontend** | http://localhost:5173 | Aplicación web |
| 📡 **Backend API** | http://localhost:3000/api | API REST |
| 🗄️ **phpMyAdmin** | http://localhost/phpmyadmin | Gestión de BD |

---

## 📈 Estadísticas del Proyecto

- 📝 **Líneas de código:** ~5,000+
- 📁 **Archivos creados:** 50+
- ⚛️ **Componentes React:** 15+
- 📡 **Endpoints API:** 25+
- 🗄️ **Tablas de BD:** 3
- 📚 **Documentación:** 8 archivos

---

## 🆘 Soporte y Ayuda

¿Tienes problemas? Consulta:
1. **[FAQ.md](FAQ.md)** - Preguntas frecuentes
2. **[INSTALACION.md](INSTALACION.md)** - Guía detallada
3. **[SEGURIDAD_Y_MANTENIMIENTO.md](SEGURIDAD_Y_MANTENIMIENTO.md)** - Solución de problemas

---

## 📝 Licencia

Este proyecto está desarrollado para la **Municipalidad de Piura** y los practicantes de la **Universidad César Vallejo (UCV)**.

---

## 🏢 Cliente

<div align="center">

**Municipalidad de Piura**  
*Sistema de Asistencia para Practicantes UCV*

**Universidad César Vallejo**  
*Practicantes en formación*

---

**Desarrollado con ❤️ en Perú** 🇵🇪

*Versión 1.0.0 - Noviembre 2024*

</div>
