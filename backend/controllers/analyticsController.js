import db from '../config/database.js';

// ============================================
// DASHBOARD ANALYTICS GENERAL
// ============================================

export const getDashboardAnalytics = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    // Métricas de clientes
    const [totalClientes] = await db.query('SELECT COUNT(*) as total FROM clientes');
    const [clientesActivos] = await db.query("SELECT COUNT(*) as total FROM clientes WHERE estado = 'Activo'");
    const [clientesPorSegmento] = await db.query(
      `SELECT s.tipo, COUNT(*) as cantidad
       FROM clientes c
       INNER JOIN segmentos_cliente s ON c.segmento_id = s.id
       GROUP BY s.tipo`
    );

    // Métricas de contratos
    const [totalContratos] = await db.query('SELECT COUNT(*) as total FROM contratos');
    const [contratosActivos] = await db.query("SELECT COUNT(*) as total FROM contratos WHERE estado = 'Activo'");

    // Métricas de facturación
    let facturacionWhere = '';
    const facturacionParams = [];
    if (fecha_inicio && fecha_fin) {
      facturacionWhere = 'WHERE fecha_emision BETWEEN ? AND ?';
      facturacionParams.push(fecha_inicio, fecha_fin);
    }

    const [totalFacturado] = await db.query(
      `SELECT COALESCE(SUM(total), 0) as total FROM facturas ${facturacionWhere}`,
      facturacionParams
    );

    // Métricas de soporte
    const [ticketsAbiertos] = await db.query(
      "SELECT COUNT(*) as total FROM tickets_soporte WHERE estado IN ('Abierto', 'En Proceso')"
    );
    const [ticketsResueltos] = await db.query(
      `SELECT COUNT(*) as total FROM tickets_soporte
       WHERE estado = 'Resuelto' ${facturacionWhere.replace('fecha_emision', 'fecha_resolucion') || ''}`,
      facturacionParams
    );

    // Métricas de redes
    const [totalNodos] = await db.query('SELECT COUNT(*) as total FROM nodos_red');
    const [nodosOperativos] = await db.query(
      "SELECT COUNT(*) as total FROM nodos_red WHERE estado = 'Operativo'"
    );

    // Tasa de satisfacción (promedio de satisfacción de tickets resueltos)
    const [satisfaccion] = await db.query(
      `SELECT AVG(satisfaccion_cliente) as promedio
       FROM tickets_soporte
       WHERE satisfaccion_cliente IS NOT NULL`
    );

    res.json({
      success: true,
      data: {
        clientes: {
          total: totalClientes[0].total,
          activos: clientesActivos[0].total,
          por_segmento: clientesPorSegmento,
        },
        contratos: {
          total: totalContratos[0].total,
          activos: contratosActivos[0].total,
        },
        facturacion: {
          total: parseFloat(totalFacturado[0].total),
        },
        soporte: {
          tickets_abiertos: ticketsAbiertos[0].total,
          tickets_resueltos: ticketsResueltos[0].total,
          satisfaccion_promedio: satisfaccion[0].promedio ? parseFloat(satisfaccion[0].promedio).toFixed(2) : null,
        },
        redes: {
          total_nodos: totalNodos[0].total,
          nodos_operativos: nodosOperativos[0].total,
        },
      },
    });
  } catch (error) {
    console.error('Error al obtener analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// PREDICCIONES IA
// ============================================

export const crearPrediccion = async (req, res) => {
  try {
    const {
      tipo_prediccion,
      entidad_tipo,
      entidad_id,
      valor_predicho,
      confianza,
      fecha_objetivo,
      observaciones,
    } = req.body;

    if (!tipo_prediccion || !entidad_tipo || !valor_predicho || !confianza) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de predicción, entidad, valor y confianza son requeridos',
      });
    }

    const [result] = await db.query(
      `INSERT INTO predicciones_ia (
        tipo_prediccion, entidad_tipo, entidad_id,
        valor_predicho, confianza, fecha_objetivo, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tipo_prediccion,
        entidad_tipo,
        entidad_id || null,
        valor_predicho,
        confianza,
        fecha_objetivo || null,
        observaciones || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Predicción creada correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al crear predicción:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const getPredicciones = async (req, res) => {
  try {
    const { tipo_prediccion, entidad_tipo, fecha_objetivo } = req.query;
    let query = 'SELECT * FROM predicciones_ia WHERE 1=1';
    const params = [];

    if (tipo_prediccion) {
      query += ' AND tipo_prediccion = ?';
      params.push(tipo_prediccion);
    }

    if (entidad_tipo) {
      query += ' AND entidad_tipo = ?';
      params.push(entidad_tipo);
    }

    if (fecha_objetivo) {
      query += ' AND fecha_objetivo >= ?';
      params.push(fecha_objetivo);
    }

    query += ' ORDER BY fecha_prediccion DESC LIMIT 100';

    const [predicciones] = await db.query(query, params);

    res.json({
      success: true,
      data: predicciones,
    });
  } catch (error) {
    console.error('Error al obtener predicciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// ANÁLISIS DE TENDENCIAS
// ============================================

export const getTendenciasVentas = async (req, res) => {
  try {
    const { meses = 6 } = req.query;

    // Tendencias de contratos por mes
    const [tendenciasContratos] = await db.query(
      `SELECT 
        DATE_FORMAT(fecha_inicio, '%Y-%m') as mes,
        COUNT(*) as cantidad,
        SUM(precio_mensual) as ingresos_proyectados
       FROM contratos
       WHERE fecha_inicio >= DATE_SUB(NOW(), INTERVAL ? MONTH)
       GROUP BY DATE_FORMAT(fecha_inicio, '%Y-%m')
       ORDER BY mes DESC`,
      [meses]
    );

    // Tendencias de facturación
    const [tendenciasFacturacion] = await db.query(
      `SELECT 
        DATE_FORMAT(fecha_emision, '%Y-%m') as mes,
        COUNT(*) as cantidad_facturas,
        SUM(total) as total_facturado
       FROM facturas
       WHERE fecha_emision >= DATE_SUB(NOW(), INTERVAL ? MONTH)
       GROUP BY DATE_FORMAT(fecha_emision, '%Y-%m')
       ORDER BY mes DESC`,
      [meses]
    );

    // Servicios más contratados
    const [serviciosPopulares] = await db.query(
      `SELECT s.nombre, s.categoria, COUNT(*) as cantidad_contratos
       FROM contratos c
       INNER JOIN servicios s ON c.servicio_id = s.id
       WHERE c.fecha_inicio >= DATE_SUB(NOW(), INTERVAL ? MONTH)
       GROUP BY s.id, s.nombre, s.categoria
       ORDER BY cantidad_contratos DESC
       LIMIT 10`,
      [meses]
    );

    res.json({
      success: true,
      data: {
        tendencias_contratos: tendenciasContratos,
        tendencias_facturacion: tendenciasFacturacion,
        servicios_populares: serviciosPopulares,
      },
    });
  } catch (error) {
    console.error('Error al obtener tendencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// ANÁLISIS DE CHURN (Pérdida de clientes)
// ============================================

export const getAnalisisChurn = async (req, res) => {
  try {
    // Clientes inactivos
    const [clientesInactivos] = await db.query(
      "SELECT COUNT(*) as total FROM clientes WHERE estado = 'Inactivo'"
    );

    // Contratos cancelados en los últimos 3 meses
    const [contratosCancelados] = await db.query(
      `SELECT COUNT(*) as total
       FROM contratos
       WHERE estado = 'Cancelado'
       AND fecha_actualizacion >= DATE_SUB(NOW(), INTERVAL 3 MONTH)`
    );

    // Razones de cancelación (basado en observaciones de contratos)
    const [razonesCancelacion] = await db.query(
      `SELECT 
        CASE
          WHEN observaciones LIKE '%precio%' OR observaciones LIKE '%costoso%' THEN 'Precio'
          WHEN observaciones LIKE '%servicio%' OR observaciones LIKE '%calidad%' THEN 'Calidad de Servicio'
          WHEN observaciones LIKE '%cobertura%' OR observaciones LIKE '%señal%' THEN 'Cobertura'
          ELSE 'Otras'
        END as razon,
        COUNT(*) as cantidad
       FROM contratos
       WHERE estado = 'Cancelado'
       AND observaciones IS NOT NULL
       GROUP BY razon`
    );

    res.json({
      success: true,
      data: {
        clientes_inactivos: clientesInactivos[0].total,
        contratos_cancelados_3meses: contratosCancelados[0].total,
        razones_cancelacion: razonesCancelacion,
      },
    });
  } catch (error) {
    console.error('Error al obtener análisis de churn:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

