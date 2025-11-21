// Controlador del chatbot con respuestas contextuales y amigables
export const sendMessage = async (req, res) => {
  try {
    const { message, userRole } = req.body;
    const messageLower = message.toLowerCase().trim();

    // Respuestas según el rol y el mensaje
    let response = '';

    // Saludos
    if (messageLower.match(/^(hola|hi|buenos días|buenas tardes|buenas noches|saludos|inicio)/i)) {
      response = `¡Hola! 👋 Es un gusto saludarte. Soy tu asistente virtual y estoy aquí para ayudarte a usar el sistema paso a paso.

¿En qué puedo ayudarte hoy? Aquí tienes algunas opciones:

${getQuickHelp(userRole)}`;
    }
    // Ayuda general
    else if (messageLower.match(/^(ayuda|help|cómo|como|qué puedo|que puedo|información|info)/i)) {
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
        response = 'Disculpa, la sección de reportes es exclusiva para administradores. Sin embargo, puedes ver tu historial personal en la sección "Mi Historial".';
      }
    }
    // CRM
    else if (messageLower.match(/^(crm|cliente|clientes|contrato|contratos|ticket|tickets|servicio|servicios)/i)) {
      if (userRole === 'admin') response = getCRMHelp();
      else response = 'Lo siento, el módulo CRM es solo para administradores.';
    }
    // Redes
    else if (messageLower.match(/^(red|redes|nodo|nodos|alerta|alertas|metrica|metricas|internet|fibra)/i)) {
      if (userRole === 'admin') response = getRedesHelp();
      else response = 'Lo siento, el módulo de Redes es solo para administradores.';
    }
    // Facturación
    else if (messageLower.match(/^(factura|facturas|facturación|facturacion|pago|pagos|cobro|cobros)/i)) {
      if (userRole === 'admin') response = getFacturacionHelp();
      else response = 'Lo siento, el módulo de Facturación es solo para administradores.';
    }
    // Analytics
    else if (messageLower.match(/^(analytics|analítica|analitica|predicción|prediccion|ia|inteligencia|tendencia)/i)) {
      if (userRole === 'admin') response = getAnalyticsHelp();
      else response = 'Lo siento, el módulo de Analytics es solo para administradores.';
    }
    // Ciberseguridad
    else if (messageLower.match(/^(seguridad|ciberseguridad|virus|ataque|incidente|incidentes|auditoria|auditorias)/i)) {
      if (userRole === 'admin') response = getCiberseguridadHelp();
      else response = 'Lo siento, el módulo de Ciberseguridad es solo para administradores.';
    }
    // Trabajadores/Practicantes (solo admin)
    else if (messageLower.match(/^(trabajador|trabajadores|practicante|practicantes|empleado|empleados)/i)) {
      if (userRole === 'admin') {
        response = getTrabajadoresHelp();
      } else {
        response = 'La gestión de trabajadores es una función administrativa.';
      }
    }
    // Horarios
    else if (messageLower.match(/^(horario|horarios|hora|cuándo|cuando|tiempo)/i)) {
      response = getHorariosHelp();
    }
    // Despedidas
    else if (messageLower.match(/^(gracias|thank|bye|adiós|adios|chau|nos vemos)/i)) {
      response = '¡Ha sido un placer ayudarte! 😊 Recuerda que estoy aquí si necesitas algo más. ¡Que tengas un excelente día!';
    }
    // Respuesta por defecto
    else {
      response = `Entiendo que me preguntas sobre "${message}", pero no estoy seguro de cómo responder a eso específicamente.

Sin embargo, puedo explicarte cómo funciona cualquiera de estos módulos:
${getQuickHelp(userRole)}

¿Te gustaría que te explique alguno de estos?`;
    }

    res.json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error('Error en chatbot:', error);
    res.status(500).json({
      success: false,
      response: 'Lo siento mucho, tuve un pequeño problema técnico. ¿Podrías intentar preguntarme de nuevo, por favor?',
    });
  }
};

// Funciones auxiliares para generar respuestas amigables

function getQuickHelp(role) {
  if (role === 'admin') {
    return '• 👥 **CRM**: Clientes y Contratos\n• 📡 **Redes**: Monitoreo y Alertas\n• 💰 **Facturación**: Pagos y Facturas\n• 📊 **Analytics**: Predicciones y Datos\n• 🛡️ **Seguridad**: Incidentes y Auditoría\n• 📋 **Asistencias**: Control de Personal';
  } else {
    return '• 📱 **Mi QR**: Ver mi código\n• 📋 **Historial**: Mis asistencias\n• 👤 **Perfil**: Mis datos\n• ❓ **Ayuda**: Cómo usar el sistema';
  }
}

function getGeneralHelp(role) {
  if (role === 'admin') {
    return `**Guía del Sistema Integral:**

El sistema está dividido en módulos para facilitar su uso. Aquí te explico qué puedes hacer en cada uno:

1.  **CRM (Clientes)** 👥
    Gestiona toda la información de tus clientes, sus contratos y si tienen algún problema (tickets).

2.  **Redes** 📡
    Supervisa el estado de las antenas y conexiones. El sistema te avisará si algo falla.

3.  **Facturación** 💰
    Crea facturas electrónicas y registra los pagos de los clientes.

4.  **Analytics** 📊
    Usa inteligencia artificial para ver tendencias y predecir el futuro de tu negocio.

5.  **Ciberseguridad** 🛡️
    Protege el sistema registrando cualquier actividad sospechosa o virus.

¿Sobre cuál de estos módulos te gustaría saber más detalles?`;
  } else {
    return `**Guía para el Usuario:**

El sistema es muy sencillo. Aquí tienes lo principal:

1.  **Tu Código QR** 📱
    Es tu identificación digital. Lo necesitas para marcar tu entrada y salida.

2.  **Marcar Asistencia** ⏱️
    Solo muestra tu código QR al administrador cuando llegues y cuando te vayas.

3.  **Tu Historial** 📋
    Aquí puedes ver todas las veces que has marcado asistencia y si tienes tardanzas.

¿Hay algo específico que no te quede claro?`;
  }
}

function getQRHelp(role) {
  if (role === 'admin') {
    return `**Sobre el Código QR (Administrador):**

El código QR es la llave para registrar la asistencia.

**¿Cómo registrar una asistencia?**
1.  Ve a la sección **"Asistencias"**.
2.  Elige si es **Entrada** o **Salida**.
3.  Presiona **"Escanear"** y apunta la cámara al código del trabajador.
4.  ¡Listo! El sistema te confirmará el registro.

También puedes subir una foto del código si no tienes cámara.`;
  } else {
    return `**Tu Código QR Personal:**

Este código es único para ti, como tu DNI.

**¿Cómo lo uso?**
1.  Entra a la sección **"Mi Código QR"**.
2.  Verás una imagen cuadrada con puntos negros.
3.  Muéstrasela al administrador cuando llegues al trabajo y cuando te vayas.

**Consejo:** Puedes descargarlo en tu celular para tenerlo siempre a la mano.`;
  }
}

function getAsistenciaHelp(role) {
  return `**Registro de Asistencias:**

El proceso es muy simple:

1.  **Entrada:** Se debe registrar al llegar, idealmente antes de las 8:00 AM.
2.  **Salida:** Se registra al terminar la jornada, después de la 1:00 PM.

**Recuerda:**
El sistema marca automáticamente si llegaste tarde (Tardanza) o si te fuiste antes de tiempo (Salida Temprana). ¡Intenta ser puntual!`;
}

function getReportesHelp() {
  return `**Reportes y Estadísticas:**

Aquí puedes ver cómo va todo en el sistema.

*   **Dashboard:** Es la pantalla principal con los números más importantes del día.
*   **Tardanzas:** Una lista de quiénes llegaron tarde.
*   **Salidas Tempranas:** Una lista de quiénes se fueron antes.

Puedes filtrar por fechas para ver reportes de la semana o el mes pasado.`;
}

function getTrabajadoresHelp() {
  return `**Gestión de Trabajadores:**

En esta sección puedes administrar a tu personal.

*   **Nuevo Trabajador:** Usa el botón "Nuevo" para registrar a alguien. El sistema le creará su código QR automáticamente.
*   **Editar:** Si alguien cambió de teléfono o dirección, puedes actualizarlo aquí.
*   **Eliminar:** Si alguien ya no trabaja contigo, puedes desactivarlo del sistema.`;
}

function getHorariosHelp() {
  return `**Horarios de Trabajo:**

Para que lo tengas claro:

*   ☀️ **Entrada:** 8:00 AM (Llega antes para evitar tardanzas).
*   🏠 **Salida:** 1:00 PM (Sal después para completar tu jornada).

El sistema es estricto con estos horarios para llevar un buen control.`;
}

// --- NUEVOS MÓDULOS ---

function getCRMHelp() {
  return `**Módulo CRM (Gestión de Clientes):**

Este módulo es tu agenda inteligente de clientes.

*   **Clientes:** Aquí guardas los datos de las personas o empresas (nombre, DNI, teléfono).
*   **Contratos:** Asocia un servicio (como Internet) a un cliente.
*   **Tickets:** Si un cliente tiene un problema, crea un "Ticket" para darle seguimiento hasta solucionarlo.

**¿Cómo empezar?** Ve a la pestaña CRM y prueba registrar un nuevo cliente.`;
}

function getRedesHelp() {
  return `**Módulo de Redes:**

Aquí vigilamos la infraestructura técnica.

*   **Nodos:** Son los puntos de conexión (postes, antenas). Puedes ver dónde están.
*   **Alertas:** Si un nodo falla (se pone en rojo), el sistema te avisa aquí.
*   **Métricas:** Gráficos técnicos sobre la velocidad y estabilidad de la red.

Es vital revisar esto para asegurar que los clientes tengan buen servicio.`;
}

function getFacturacionHelp() {
  return `**Módulo de Facturación:**

La parte financiera del negocio.

*   **Facturas:** Genera los comprobantes de pago para los clientes.
*   **Pagos:** Registra cuando un cliente paga su recibo.
*   **Dashboard:** Ve cuánto dinero ha ingresado este mes.

Todo está calculado automáticamente para evitar errores matemáticos.`;
}

function getAnalyticsHelp() {
  return `**Módulo Analytics (Inteligencia Artificial):**

Este es el cerebro del sistema.

*   **Predicciones:** El sistema intenta adivinar qué pasará el próximo mes basándose en el pasado.
*   **Tendencias:** Gráficos que te muestran si las ventas suben o bajan.
*   **Churn:** Te avisa qué clientes están en riesgo de irse a la competencia.

¡Úsalo para tomar decisiones inteligentes!`;
}

function getCiberseguridadHelp() {
  return `**Módulo de Ciberseguridad:**

El guardián del sistema.

*   **Incidentes:** Si entra un virus o hay un ataque, regístralo aquí.
*   **Auditoría:** Un historial de "quién hizo qué" en el sistema.
*   **Nuevo Incidente:** Usa el botón para reportar cualquier amenaza.

Mantén esto revisado para proteger los datos de todos.`;
}
