# ❓ Preguntas Frecuentes (FAQ)

## 📋 General

### ¿Qué es este sistema?
Es un sistema de registro de asistencia digital que utiliza códigos QR para marcar entrada y salida de practicantes de la Universidad César Vallejo en la Municipalidad de Piura.

### ¿Quién puede usar el sistema?
Hay dos tipos de usuarios:
- **Administradores:** Personal de la municipalidad que gestiona el sistema
- **Practicantes:** Estudiantes que marcan su asistencia

### ¿Necesito internet para usar el sistema?
Sí, el sistema requiere conexión a internet para funcionar correctamente.

---

## 🔐 Autenticación y Acceso

### ¿Cómo obtengo mis credenciales?
- **Administradores:** El administrador principal crea las cuentas
- **Practicantes:** Se crean automáticamente cuando el admin los registra

### ¿Cuál es mi usuario y contraseña por defecto?
- **Practicantes:** Usuario = tu código (ej: PRACT-001), Contraseña = 123456
- **Administradores:** Te lo proporciona el administrador principal

### ¿Puedo cambiar mi contraseña?
Sí, desde tu perfil puedes cambiar tu contraseña en cualquier momento.

### ¿Qué hago si olvidé mi contraseña?
Contacta al administrador del sistema para que la restablezca.

---

## 📱 Código QR

### ¿Cómo obtengo mi código QR?
1. Inicia sesión como practicante
2. Ve a "Mi Código QR"
3. Ahí verás tu código QR personal

### ¿Puedo descargar mi código QR?
Sí, hay un botón "Descargar Código QR" que lo guarda como imagen PNG.

### ¿Puedo imprimir mi código QR?
Sí, puedes descargarlo e imprimirlo para tenerlo siempre disponible.

### ¿El código QR expira?
No, tu código QR es permanente mientras seas practicante activo.

### ¿Qué pasa si pierdo mi código QR?
Puedes volver a descargarlo desde tu perfil en cualquier momento.

---

## ⏰ Registro de Asistencia

### ¿Cómo marco mi asistencia?
1. Muestra tu código QR al administrador
2. El administrador lo escanea con la cámara
3. Tu asistencia se registra automáticamente

### ¿A qué hora debo marcar entrada?
El horario oficial de entrada es **8:00 AM**.

### ¿A qué hora debo marcar salida?
El horario oficial de salida es **1:00 PM**.

### ¿Qué pasa si llego tarde?
El sistema detecta automáticamente las tardanzas (después de las 8:00 AM) y las registra.

### ¿Puedo marcar entrada dos veces en el mismo día?
No, el sistema no permite marcar dos veces el mismo tipo (entrada o salida) en un día.

### ¿Qué pasa si olvido marcar mi salida?
Debes comunicarlo al administrador. Solo se registra lo que se escanea.

### ¿Puedo ver mi historial de asistencias?
Sí, en tu panel hay una sección "Mi Historial" con todas tus marcaciones.

---

## 📊 Reportes y Estadísticas

### ¿Cómo veo mis estadísticas?
En "Mi Historial" puedes ver:
- Total de asistencias
- Total de tardanzas
- Total de salidas tempranas

### ¿Los administradores pueden ver mi historial?
Sí, los administradores tienen acceso a todos los historiales para generar reportes.

### ¿Qué reportes genera el sistema?
- Reporte de tardanzas
- Reporte de salidas tempranas
- Estadísticas generales
- Dashboard con datos del día

---

## 🔧 Problemas Técnicos

### La cámara no funciona, ¿qué hago?
1. Verifica que diste permiso para usar la cámara
2. Usa Chrome o Edge (funcionan mejor)
3. Asegúrate de estar en localhost o HTTPS
4. Recarga la página

### No puedo iniciar sesión, ¿qué hago?
1. Verifica que tu usuario y contraseña sean correctos
2. Asegúrate de que tu cuenta esté activa
3. Contacta al administrador si el problema persiste

### El sistema está lento, ¿por qué?
1. Verifica tu conexión a internet
2. Cierra otras aplicaciones pesadas
3. Limpia el caché del navegador

### Veo un error "Token inválido"
Tu sesión expiró. Cierra sesión y vuelve a iniciar sesión.

---

## 👨‍💼 Para Administradores

### ¿Cómo registro un nuevo practicante?
1. Ve a "Practicantes"
2. Clic en "Nuevo Practicante"
3. Llena el formulario
4. El sistema genera automáticamente usuario y contraseña

### ¿Cómo escaneo códigos QR?
1. Ve a "Asistencias"
2. Selecciona "Entrada" o "Salida"
3. Clic en "Iniciar Cámara"
4. Apunta la cámara al código QR

### ¿Puedo eliminar una asistencia registrada por error?
Sí, en la lista de asistencias hay un botón de eliminar (🗑️) en cada registro.

### ¿Cómo genero reportes?
Ve a la sección "Reportes" donde encontrarás:
- Tardanzas
- Salidas tempranas
- Puedes filtrar por fechas

### ¿Puedo crear más administradores?
Sí, en "Administradores" puedes crear nuevas cuentas de admin.

### ¿Cómo edito la información de un practicante?
1. Ve a "Practicantes"
2. Clic en el ícono de editar (✏️)
3. Modifica los datos
4. Guarda los cambios

---

## 📱 Compatibilidad

### ¿En qué navegadores funciona?
- ✅ Google Chrome (recomendado)
- ✅ Microsoft Edge
- ✅ Firefox
- ⚠️ Safari (puede tener problemas con la cámara)

### ¿Funciona en celulares?
Sí, el sistema es responsive y funciona en:
- Smartphones
- Tablets
- Computadoras

### ¿Necesito instalar algo?
No, solo necesitas un navegador web moderno.

---

## 🔒 Seguridad y Privacidad

### ¿Mis datos están seguros?
Sí, el sistema utiliza:
- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- Validación de roles y permisos

### ¿Quién puede ver mi información?
Solo los administradores del sistema pueden ver la información de los practicantes.

### ¿Puedo eliminar mi cuenta?
Solo los administradores pueden eliminar cuentas.

---

## 📞 Soporte

### ¿A quién contacto si tengo problemas?
Contacta al administrador del sistema de la Municipalidad de Piura.

### ¿Hay un manual de usuario?
Sí, revisa los archivos:
- `README.md` - Documentación general
- `INSTALACION.md` - Guía de instalación
- `INICIO_RAPIDO.md` - Inicio rápido

### ¿El sistema se actualiza?
El sistema puede recibir actualizaciones. El administrador te notificará.

---

## 🎯 Mejores Prácticas

### Como Practicante:
- ✅ Descarga tu QR y tenlo siempre disponible
- ✅ Llega puntual para evitar tardanzas
- ✅ Marca tu salida antes de irte
- ✅ Revisa tu historial regularmente
- ✅ Cambia tu contraseña por defecto

### Como Administrador:
- ✅ Verifica la cámara antes de empezar el día
- ✅ Revisa el dashboard diariamente
- ✅ Genera reportes semanalmente
- ✅ Mantén actualizada la información de practicantes
- ✅ Haz backup de la base de datos regularmente

---

## 🆘 Problemas Comunes y Soluciones

| Problema | Solución |
|----------|----------|
| No puedo ver mi QR | Verifica que iniciaste sesión como practicante |
| La cámara no escanea | Asegúrate de tener buena iluminación |
| Error al registrar | Verifica que no hayas marcado ya ese tipo hoy |
| Olvidé mi contraseña | Contacta al administrador |
| Mi cuenta está inactiva | Contacta al administrador |
| El sistema está caído | Verifica que backend y frontend estén corriendo |

---

## 📈 Futuras Mejoras

El sistema está diseñado para crecer. Posibles mejoras futuras:
- 📧 Notificaciones por email
- 📊 Gráficos y estadísticas avanzadas
- 📱 App móvil nativa
- 🔔 Alertas de tardanzas
- 📄 Exportación a Excel/PDF
- 🤖 Integración con otros sistemas

---

**¿Tienes más preguntas?**  
Contacta al administrador del sistema o revisa la documentación completa.

---

**Sistema de Asistencia QR**  
Municipalidad de Piura - Practicantes UCV
