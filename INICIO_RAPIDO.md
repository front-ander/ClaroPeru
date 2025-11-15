# 🚀 Inicio Rápido - 3 Pasos

## ⚡ Configuración Rápida (5 minutos)

### Paso 1️⃣: Base de Datos (2 minutos)

1. Abre XAMPP y inicia **Apache** y **MySQL**
2. Ve a: http://localhost/phpmyadmin
3. Clic en pestaña **"SQL"**
4. Abre el archivo `database.sql` del proyecto
5. Copia TODO el contenido y pégalo en phpMyAdmin
6. Clic en **"Continuar"**

✅ **Listo!** Base de datos creada con usuarios de prueba

---

### Paso 2️⃣: Iniciar Backend (1 minuto)

Abre una terminal en la carpeta del proyecto:

```bash
cd backend
npm install
npm run dev
```

✅ Verás: **"Servidor corriendo en: http://localhost:3000"**

**⚠️ NO CIERRES ESTA TERMINAL**

---

### Paso 3️⃣: Iniciar Frontend (1 minuto)

Abre **OTRA** terminal (nueva):

```bash
cd frontend
npm install
npm run dev
```

✅ Verás: **"Local: http://localhost:5173/"**

---

## 🎯 Acceder al Sistema

### Abre tu navegador en:
**http://localhost:5173**

### Usuarios de Prueba:

**👨‍💼 Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

**👨‍🎓 Practicante:**
- Usuario: `PRACT-001`
- Contraseña: `123456`

---

## 🎬 Prueba Rápida del Sistema

### Como Administrador:
1. Login con `admin` / `admin123`
2. Ve a **"Asistencias"**
3. Selecciona **"Entrada"**
4. Clic en **"Iniciar Cámara"**
5. Permite acceso a la cámara

### Como Practicante (en otra pestaña):
1. Login con `PRACT-001` / `123456`
2. Ve a **"Mi Código QR"**
3. Muestra el QR a la cámara del admin

### Resultado:
✅ **Se registrará la asistencia automáticamente!**

---

## ❓ Problemas Comunes

### ❌ "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo en XAMPP
- Usuario: `root`, Contraseña: vacía

### ❌ "Port already in use"
- Cierra otras aplicaciones que usen el puerto 3000 o 5173

### ❌ La cámara no funciona
- Usa Chrome o Edge (funciona mejor)
- Permite acceso a la cámara cuando lo pida
- Debe ser localhost o HTTPS

---

## 📚 Más Información

- **Instalación Detallada:** Ver `INSTALACION.md`
- **Documentación Completa:** Ver `README.md`
- **Resumen del Proyecto:** Ver `RESUMEN.md`

---

**¡Eso es todo! Sistema listo en 5 minutos** 🎉
