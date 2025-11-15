// Controlador del chatbot con respuestas contextuales
export const sendMessage = async (req, res) => {
  try {
    const { message, userRole } = req.body;
    const messageLower = message.toLowerCase().trim();

    // Respuestas según el rol y el mensaje
    let response = '';

    // Saludos
    if (messageLower.match(/^(hola|hi|buenos días|buenas tardes|buenas noches|saludos)/i)) {
      response = `¡Hola! 👋 ¿En qué puedo ayudarte hoy? Puedo ayudarte con:\n\n${getQuickHelp(userRole)}`;
    }
    // Ayuda general
    else if (messageLower.match(/^(ayuda|help|cómo|como|qué puedo|que puedo|información)/i)) {
      response = getGeneralHelp(userRole);
    }
    // Código QR
    else if (messageLower.match(/^(qr|código|codigo|qr code|escaneo|escanear)/i)) {
      response = getQRHelp(userRole);
    }
    // Asistencias
    else if (messageLower.match(/^(asistencia|asistencias|marcar|registrar|entrada|salida)/i)) {
      response = getAsistenciaHelp(userRole);
    }
    // Reportes (solo admin)
    else if (messageLower.match(/^(reporte|reportes|estadística|estadisticas|dashboard)/i)) {
      if (userRole === 'admin') {
        response = getReportesHelp();
      } else {
        response = 'Los reportes solo están disponibles para administradores. Puedes ver tu historial personal en la sección "Mi Historial".';
      }
    }
    // Trabajadores/Practicantes (solo admin)
    else if (messageLower.match(/^(trabajador|trabajadores|practicante|practicantes|empleado|empleados)/i)) {
      if (userRole === 'admin') {
        response = getTrabajadoresHelp();
      } else {
        response = 'La gestión de trabajadores solo está disponible para administradores.';
      }
    }
    // Administradores (solo admin)
    else if (messageLower.match(/^(admin|administrador|administradores)/i)) {
      if (userRole === 'admin') {
        response = getAdministradoresHelp();
      } else {
        response = 'La gestión de administradores solo está disponible para administradores.';
      }
    }
    // Horarios
    else if (messageLower.match(/^(horario|horarios|hora|cuándo|cuando|tiempo)/i)) {
      response = getHorariosHelp();
    }
    // Tardanzas
    else if (messageLower.match(/^(tardanza|tardanzas|tarde|retraso)/i)) {
      response = getTardanzasHelp(userRole);
    }
    // Salidas tempranas
    else if (messageLower.match(/^(salida temprana|salidas tempranas|salir temprano)/i)) {
      response = getSalidasTempranasHelp(userRole);
    }
    // Navegación
    else if (messageLower.match(/^(ir a|navegar|dónde|donde|ubicación|ubicacion)/i)) {
      response = getNavegacionHelp(userRole);
    }
    // Despedidas
    else if (messageLower.match(/^(gracias|thank|bye|adiós|adios|chau|nos vemos)/i)) {
      response = '¡De nada! 😊 Si necesitas algo más, no dudes en preguntar. ¡Que tengas un buen día!';
    }
    // Respuesta por defecto
    else {
      response = `Entiendo que preguntas sobre "${message}". Puedo ayudarte con:\n\n${getQuickHelp(userRole)}\n\n¿Podrías ser más específico sobre qué necesitas?`;
    }

    res.json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error('Error en chatbot:', error);
    res.status(500).json({
      success: false,
      response: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
    });
  }
};

// Funciones auxiliares para generar respuestas

function getQuickHelp(role) {
  if (role === 'admin') {
    return '• 📋 Registrar asistencias\n• 👥 Gestionar trabajadores\n• 📊 Ver reportes\n• ⚙️ Administrar usuarios\n• ❓ Información sobre el sistema';
  } else {
    return '• 📱 Ver mi código QR\n• 📋 Ver mi historial\n• 👤 Actualizar mi perfil\n• ❓ Información sobre el sistema';
  }
}

function getGeneralHelp(role) {
  if (role === 'admin') {
    return `**Guía rápida del sistema:**\n\n**1. Dashboard** 📊\n- Ve a "Dashboard" para ver estadísticas en tiempo real\n- Total de trabajadores, asistencias del día, tardanzas, etc.\n\n**2. Trabajadores** 👥\n- Gestiona todos los trabajadores del sistema\n- Crea, edita o elimina trabajadores\n- Cada trabajador tiene un código QR único\n\n**3. Asistencias** 📋\n- Escanea códigos QR para registrar entrada/salida\n- Selecciona el tipo (entrada o salida) antes de escanear\n- Ve las asistencias del día en tiempo real\n\n**4. Reportes** 📈\n- Genera reportes de tardanzas y salidas tempranas\n- Filtra por fechas\n- Exporta información detallada\n\n**5. Administradores** ⚙️\n- Gestiona usuarios con acceso al panel\n\n¿Sobre qué sección necesitas más información?`;
  } else {
    return `**Guía rápida del sistema:**\n\n**1. Mi Código QR** 📱\n- Ve a "Mi Código QR" para ver tu código personal\n- Puedes descargarlo e imprimirlo\n- Muéstralo al administrador para registrar tu asistencia\n\n**2. Mi Perfil** 👤\n- Actualiza tu información personal\n- Cambia tu contraseña\n- Modifica tu teléfono, email, etc.\n\n**3. Mi Historial** 📋\n- Ve todas tus asistencias registradas\n- Consulta tus estadísticas (tardanzas, salidas tempranas)\n- Revisa tu historial completo\n\n**Horarios:**\n- Entrada: 8:00 AM\n- Salida: 1:00 PM\n\n¿Sobre qué necesitas más información?`;
  }
}

function getQRHelp(role) {
  if (role === 'admin') {
    return `**Código QR - Para Administradores:**\n\n**Cómo escanear:**\n1. Ve a la sección "Asistencias"\n2. Selecciona el tipo de registro (Entrada o Salida)\n3. Haz clic en "Iniciar Cámara"\n4. Apunta la cámara al código QR del trabajador\n5. El sistema registrará automáticamente la asistencia\n\n**También puedes:**\n- Cargar una imagen con el código QR\n- El sistema detectará automáticamente si es entrada o salida\n\n**Nota:** No se puede registrar el mismo tipo dos veces en un día.`;
  } else {
    return `**Mi Código QR:**\n\n**Cómo usar tu código QR:**\n1. Ve a la sección "Mi Código QR"\n2. Muestra el código al administrador\n3. Puedes usar tu celular o imprimirlo\n4. El administrador lo escaneará para registrar tu asistencia\n\n**Descargar:**\n- Haz clic en "Descargar Código QR"\n- Guarda la imagen en tu dispositivo\n- Puedes imprimirlo o mostrarlo desde tu celular\n\n**Importante:**\n- Tu código QR es único e intransferible\n- Mantén tu código seguro\n- Si lo pierdes, contacta al administrador`;
  }
}

function getAsistenciaHelp(role) {
  if (role === 'admin') {
    return `**Registrar Asistencias:**\n\n**Pasos:**\n1. Ve a "Asistencias" en el menú\n2. Selecciona el tipo:\n   - **Entrada**: Para registrar llegada\n   - **Salida**: Para registrar salida\n3. Inicia la cámara o carga una imagen\n4. Escanea el código QR del trabajador\n5. El sistema registrará automáticamente\n\n**Detección automática:**\n- **Tardanza**: Si la entrada es después de las 8:00 AM\n- **Salida temprana**: Si la salida es antes de las 1:00 PM\n\n**Validaciones:**\n- No se puede registrar el mismo tipo dos veces en un día\n- El trabajador debe estar activo\n- El código QR debe ser válido`;
  } else {
    return `**Registrar mi Asistencia:**\n\n**Cómo funciona:**\n1. Ve a "Mi Código QR" y muestra tu código\n2. El administrador lo escaneará\n3. El sistema registrará automáticamente tu asistencia\n\n**Tipos de registro:**\n- **Entrada**: Cuando llegas (antes de 8:00 AM es puntual)\n- **Salida**: Cuando te vas (después de 1:00 PM es puntual)\n\n**Importante:**\n- Debes mostrar tu código QR al administrador\n- No puedes auto-registrarte\n- Revisa tu historial para ver tus registros`;
  }
}

function getReportesHelp() {
  return `**Reportes - Administradores:**\n\n**Tipos de reportes:**\n\n**1. Dashboard** 📊\n- Estadísticas en tiempo real\n- Total de trabajadores\n- Asistencias del día\n- Tardanzas y salidas tempranas\n\n**2. Reporte de Tardanzas** ⏰\n- Ve a "Reportes" → Pestaña "Tardanzas"\n- Lista todas las tardanzas\n- Resumen por trabajador\n- Puedes filtrar por fechas\n\n**3. Reporte de Salidas Tempranas** 🚪\n- Ve a "Reportes" → Pestaña "Salidas Tempranas"\n- Lista todas las salidas tempranas\n- Resumen por trabajador\n- Puedes filtrar por fechas\n\n**Cómo usar:**\n1. Ve a la sección "Reportes"\n2. Selecciona la pestaña que necesites\n3. Revisa los datos y resúmenes\n4. Los datos se actualizan en tiempo real`;
}

function getTrabajadoresHelp() {
  return `**Gestión de Trabajadores:**\n\n**Funciones disponibles:**\n\n**1. Ver trabajadores** 👥\n- Lista todos los trabajadores\n- Busca por nombre, código o documento\n- Ve su estado (activo/inactivo)\n\n**2. Crear trabajador** ➕\n- Haz clic en "Nuevo Trabajador"\n- Completa los datos requeridos\n- El sistema generará un código QR único\n- Contraseña por defecto: 123456\n\n**3. Editar trabajador** ✏️\n- Haz clic en el icono de editar\n- Modifica los datos necesarios\n- Guarda los cambios\n\n**4. Eliminar trabajador** 🗑️\n- Haz clic en el icono de eliminar\n- Confirma la acción\n- Se eliminarán también sus asistencias\n\n**Campos importantes:**\n- Código: Debe ser único (ej: PRACT-001)\n- Documento: DNI del trabajador\n- Periodo, Horario, Turno: Información adicional`;
}

function getAdministradoresHelp() {
  return `**Gestión de Administradores:**\n\n**Funciones:**\n\n**1. Ver administradores** 👥\n- Lista todos los usuarios admin\n- Ve su información de contacto\n\n**2. Crear administrador** ➕\n- Haz clic en "Nuevo Administrador"\n- Completa los datos\n- Define usuario y contraseña\n\n**3. Editar administrador** ✏️\n- Modifica información personal\n- Cambia contraseña (opcional)\n\n**4. Eliminar administrador** 🗑️\n- No puedes eliminar tu propia cuenta\n- Confirma antes de eliminar\n\n**Importante:**\n- Los administradores tienen acceso completo al sistema\n- Usa contraseñas seguras\n- No compartas tus credenciales`;
}

function getHorariosHelp() {
  return `**Horarios del Sistema:**\n\n**Horario de Entrada:**\n- Hora límite: 8:00 AM\n- Antes de las 8:00 AM: ✅ Puntual\n- Después de las 8:00 AM: ⚠️ Tardanza\n\n**Horario de Salida:**\n- Hora mínima: 1:00 PM\n- Después de las 1:00 PM: ✅ Puntual\n- Antes de las 1:00 PM: ⚠️ Salida Temprana\n\n**Duración laboral:**\n- 5 horas (de 8:00 AM a 1:00 PM)\n\n**Nota:** Estos horarios son configurables por el administrador del sistema.`;
}

function getTardanzasHelp(role) {
  if (role === 'admin') {
    return `**Tardanzas:**\n\n**¿Qué es una tardanza?**\n- Se marca cuando un trabajador registra su entrada después de las 8:00 AM\n\n**Ver tardanzas:**\n1. Ve a "Reportes"\n2. Selecciona la pestaña "Tardanzas"\n3. Verás:\n   - Resumen por trabajador\n   - Detalle de cada tardanza\n   - Fecha y hora exacta\n\n**Filtros:**\n- Puedes filtrar por rango de fechas\n- Ver tardanzas de un período específico\n\n**Estadísticas:**\n- El dashboard muestra las tardanzas del día actual`;
  } else {
    return `**Tardanzas:**\n\n**¿Qué es una tardanza?**\n- Se marca cuando registras tu entrada después de las 8:00 AM\n\n**Ver mis tardanzas:**\n1. Ve a "Mi Historial"\n2. Revisa la sección de estadísticas\n3. Verás el total de tardanzas\n4. En el historial, las tardanzas aparecen marcadas\n\n**Consejo:**\n- Intenta llegar antes de las 8:00 AM\n- Revisa tu historial regularmente\n- Contacta al administrador si hay algún error`;
  }
}

function getSalidasTempranasHelp(role) {
  if (role === 'admin') {
    return `**Salidas Tempranas:**\n\n**¿Qué es una salida temprana?**\n- Se marca cuando un trabajador registra su salida antes de las 1:00 PM\n\n**Ver salidas tempranas:**\n1. Ve a "Reportes"\n2. Selecciona la pestaña "Salidas Tempranas"\n3. Verás:\n   - Resumen por trabajador\n   - Detalle de cada salida temprana\n   - Fecha y hora exacta\n\n**Filtros:**\n- Puedes filtrar por rango de fechas\n- Ver salidas tempranas de un período específico\n\n**Estadísticas:**\n- El dashboard muestra las salidas tempranas del día actual`;
  } else {
    return `**Salidas Tempranas:**\n\n**¿Qué es una salida temprana?**\n- Se marca cuando registras tu salida antes de las 1:00 PM\n\n**Ver mis salidas tempranas:**\n1. Ve a "Mi Historial"\n2. Revisa la sección de estadísticas\n3. Verás el total de salidas tempranas\n4. En el historial, aparecen marcadas\n\n**Consejo:**\n- Intenta salir después de las 1:00 PM\n- Revisa tu historial regularmente\n- Contacta al administrador si hay algún error`;
  }
}

function getNavegacionHelp(role) {
  if (role === 'admin') {
    return `**Navegación - Panel de Administrador:**\n\n**Menú principal:**\n\n**📊 Dashboard**\n- Estadísticas generales\n- Accesos rápidos\n\n**👥 Trabajadores**\n- Gestionar trabajadores\n- Crear, editar, eliminar\n\n**📋 Asistencias**\n- Registrar asistencias\n- Ver asistencias del día\n- Escanear códigos QR\n\n**📈 Reportes**\n- Tardanzas\n- Salidas tempranas\n- Estadísticas detalladas\n\n**⚙️ Administradores**\n- Gestionar usuarios admin\n\n**💬 Chatbot**\n- Asistente virtual (este chat)\n- Siempre disponible en la esquina inferior derecha`;
  } else {
    return `**Navegación - Panel de Trabajador:**\n\n**Menú principal:**\n\n**📱 Mi Código QR**\n- Ver tu código QR personal\n- Descargar código\n\n**👤 Mi Perfil**\n- Actualizar información\n- Cambiar contraseña\n\n**📋 Mi Historial**\n- Ver todas tus asistencias\n- Estadísticas personales\n- Tardanzas y salidas tempranas\n\n**💬 Chatbot**\n- Asistente virtual (este chat)\n- Siempre disponible en la esquina inferior derecha`;
  }
}

