# 📋 Guía de Instalación - Sistema de Asistencia QR

## 🔧 Requisitos Previos

- **Node.js** v16 o superior
- **MySQL** (XAMPP, WAMP, o instalación independiente)
- **phpMyAdmin** (incluido en XAMPP/WAMP)
- **Git** (opcional)

---

## 📦 Paso 1: Configurar la Base de Datos

### 1.1 Iniciar MySQL
- Si usas **XAMPP**: Abre el panel de control y inicia **Apache** y **MySQL**
- Si usas **WAMP**: Inicia todos los servicios

### 1.2 Crear la Base de Datos
1. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
2. Haz clic en la pestaña **"SQL"**
3. Abre el archivo `database.sql` que está en la raíz del proyecto
4. Copia todo el contenido y pégalo en el editor SQL de phpMyAdmin
5. Haz clic en **"Continuar"** o **"Ejecutar"**

✅ Esto creará:
- La base de datos `asistencia_qr`
- Las tablas necesarias
- Un administrador por defecto (usuario: `admin`, contraseña: `admin123`)
- 3 practicantes de ejemplo

---

## 🖥️ Paso 2: Configurar el Backend

### 2.1 Navegar a la carpeta del backend
```bash
cd backend
```

### 2.2 Instalar dependencias
```bash
npm install
```

### 2.3 Configurar variables de entorno
El archivo `.env` ya está creado. Verifica que los datos de MySQL sean correctos:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=asistencia_qr
DB_PORT=3306
```

**Nota:** Si tu MySQL tiene contraseña, actualiza `DB_PASSWORD`

### 2.4 Iniciar el servidor backend
```bash
npm run dev
```

✅ Deberías ver:
```
╔═══════════════════════════════════════════════════════════╗
║   🏛️  Sistema de Asistencia QR                           ║
║   📍 Municipalidad de Piura                               ║
║   🎓 Practicantes UCV                                     ║
║   🚀 Servidor corriendo en: http://localhost:3000        ║
╚═══════════════════════════════════════════════════════════╝
```

**⚠️ Deja esta terminal abierta**

---

## 🌐 Paso 3: Configurar el Frontend

### 3.1 Abrir una NUEVA terminal
Abre una segunda terminal (no cierres la del backend)

### 3.2 Navegar a la carpeta del frontend
```bash
cd frontend
```

### 3.3 Instalar dependencias
```bash
npm install
```

### 3.4 Iniciar el servidor frontend
```bash
npm run dev
```

✅ Deberías ver algo como:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🚀 Paso 4: Acceder al Sistema

### 4.1 Abrir en el navegador
Ve a: **http://localhost:5173**

### 4.2 Usuarios de Prueba

#### 👨‍💼 Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`

#### 👨‍🎓 Practicantes
- **Usuario:** `PRACT-001` | **Contraseña:** `123456`
- **Usuario:** `PRACT-002` | **Contraseña:** `123456`
- **Usuario:** `PRACT-003` | **Contraseña:** `123456`

---

## 📱 Paso 5: Probar el Sistema

### Como Administrador:
1. Inicia sesión con `admin` / `admin123`
2. Ve a **"Asistencias"**
3. Haz clic en **"Iniciar Cámara"**
4. Permite el acceso a la cámara
5. Abre otra pestaña e inicia sesión como practicante
6. Ve a **"Mi Código QR"**
7. Muestra el QR a la cámara del admin
8. ✅ Se registrará la asistencia automáticamente

### Como Practicante:
1. Inicia sesión con `PRACT-001` / `123456`
2. Ve a **"Mi Código QR"** para ver tu código
3. Ve a **"Mi Historial"** para ver tus asistencias
4. Ve a **"Mi Perfil"** para editar tus datos

---

## 🔍 Solución de Problemas

### ❌ Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo en XAMPP/WAMP
- Revisa las credenciales en `backend/.env`
- Asegúrate de que el puerto sea 3306

### ❌ Error: "Port 3000 already in use"
- Cambia el puerto en `backend/.env`: `PORT=3001`
- Actualiza también `frontend/.env`: `VITE_API_URL=http://localhost:3001/api`

### ❌ Error: "Cannot find module"
- Elimina `node_modules` y ejecuta `npm install` nuevamente
- Verifica que estés en la carpeta correcta (backend o frontend)

### ❌ La cámara no funciona
- Usa **HTTPS** o **localhost** (no una IP)
- Permite el acceso a la cámara en el navegador
- Prueba con otro navegador (Chrome funciona mejor)

---

## 📊 Estructura del Proyecto

```
sistema-de-verificacion-qr/
├── backend/                 # API Node.js + Express
│   ├── config/             # Configuración de BD
│   ├── controllers/        # Lógica de negocio
│   ├── middleware/         # Autenticación JWT
│   ├── routes/             # Rutas de la API
│   ├── .env                # Variables de entorno
│   └── server.js           # Servidor principal
│
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── context/       # Context API (Auth)
│   │   ├── pages/         # Páginas del sistema
│   │   ├── services/      # API calls
│   │   └── App.jsx        # Rutas principales
│   └── package.json
│
├── database.sql           # Script de base de datos
└── README.md             # Documentación
```

---

## 🎯 Funcionalidades Implementadas

### Panel Administrador ✅
- ✅ Dashboard con estadísticas
- ✅ CRUD de practicantes
- ✅ Escáner QR en tiempo real
- ✅ Registro de asistencias (Entrada/Salida)
- ✅ Detección automática de tardanzas
- ✅ Reportes de tardanzas y salidas tempranas
- ✅ Gestión de administradores

### Panel Practicante ✅
- ✅ Código QR personal
- ✅ Descarga de código QR
- ✅ Edición de perfil
- ✅ Historial de asistencias
- ✅ Estadísticas personales

---

## 🔐 Seguridad

- ✅ Autenticación con JWT
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Roles de usuario (admin/practicante)
- ✅ Rutas protegidas
- ✅ Validación de datos

---

## 📞 Soporte

Si tienes problemas con la instalación:
1. Verifica que todos los servicios estén corriendo
2. Revisa los logs en las terminales
3. Asegúrate de tener las versiones correctas de Node.js y MySQL

---

## 🎉 ¡Listo!

El sistema está completamente funcional y listo para usar.

**Horario de Prácticas:**
- 🕐 Entrada: 8:00 AM
- 🕐 Salida: 1:00 PM
- ⏱️ Duración: 5 horas
