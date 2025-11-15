import db from '../config/database.js';

// ============================================
// NODOS DE RED
// ============================================

export const getAllNodos = async (req, res) => {
  try {
    const { tipo, estado } = req.query;
    let query = 'SELECT * FROM nodos_red WHERE 1=1';
    const params = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    if (estado) {
      query += ' AND estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY nombre';

    const [nodos] = await db.query(query, params);

    // Calcular porcentaje de uso para cada nodo
    const nodosConUso = nodos.map((nodo) => ({
      ...nodo,
      porcentaje_uso: nodo.capacidad_maxima
        ? ((nodo.capacidad_utilizada / nodo.capacidad_maxima) * 100).toFixed(2)
        : 0,
    }));

    res.json({
      success: true,
      data: nodosConUso,
    });
  } catch (error) {
    console.error('Error al obtener nodos:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const getNodoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [nodos] = await db.query('SELECT * FROM nodos_red WHERE id = ?', [id]);

    if (nodos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nodo no encontrado',
      });
    }

    const nodo = nodos[0];

    // Obtener alertas activas
    const [alertas] = await db.query(
      `SELECT * FROM alertas_red
       WHERE nodo_id = ? AND estado IN ('Abierta', 'En Proceso')
       ORDER BY fecha_alerta DESC
       LIMIT 10`,
      [id]
    );

    // Obtener últimas métricas
    const [metricas] = await db.query(
      `SELECT * FROM metricas_red
       WHERE nodo_id = ?
       ORDER BY fecha_hora DESC
       LIMIT 24`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...nodo,
        porcentaje_uso: nodo.capacidad_maxima
          ? ((nodo.capacidad_utilizada / nodo.capacidad_maxima) * 100).toFixed(2)
          : 0,
        alertas,
        metricas,
      },
    });
  } catch (error) {
    console.error('Error al obtener nodo:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const createNodo = async (req, res) => {
  try {
    const {
      codigo,
      nombre,
      tipo,
      ubicacion_lat,
      ubicacion_lng,
      direccion,
      distrito,
      provincia,
      capacidad_maxima,
      estado,
      fecha_instalacion,
    } = req.body;

    if (!codigo || !nombre || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Código, nombre y tipo son requeridos',
      });
    }

    const [result] = await db.query(
      `INSERT INTO nodos_red (
        codigo, nombre, tipo, ubicacion_lat, ubicacion_lng,
        direccion, distrito, provincia, capacidad_maxima, estado, fecha_instalacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo,
        nombre,
        tipo,
        ubicacion_lat || null,
        ubicacion_lng || null,
        direccion || null,
        distrito || null,
        provincia || null,
        capacidad_maxima || null,
        estado || 'En Construcción',
        fecha_instalacion || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Nodo creado correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al crear nodo:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const updateNodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];

    const allowedFields = [
      'codigo',
      'nombre',
      'tipo',
      'ubicacion_lat',
      'ubicacion_lng',
      'direccion',
      'distrito',
      'provincia',
      'capacidad_maxima',
      'capacidad_utilizada',
      'estado',
      'fecha_ultimo_mantenimiento',
      'proximo_mantenimiento',
      'observaciones',
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay datos para actualizar',
      });
    }

    values.push(id);
    await db.query(`UPDATE nodos_red SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({
      success: true,
      message: 'Nodo actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar nodo:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// ALERTAS DE RED
// ============================================

export const getAllAlertas = async (req, res) => {
  try {
    const { nodo_id, estado, severidad, tipo_alerta } = req.query;
    let query = `
      SELECT a.*, n.nombre as nodo_nombre, n.tipo as nodo_tipo,
             a2.nombre as resuelto_por_nombre
      FROM alertas_red a
      INNER JOIN nodos_red n ON a.nodo_id = n.id
      LEFT JOIN administradores a2 ON a.resuelto_por = a2.id
      WHERE 1=1
    `;
    const params = [];

    if (nodo_id) {
      query += ' AND a.nodo_id = ?';
      params.push(nodo_id);
    }

    if (estado) {
      query += ' AND a.estado = ?';
      params.push(estado);
    }

    if (severidad) {
      query += ' AND a.severidad = ?';
      params.push(severidad);
    }

    if (tipo_alerta) {
      query += ' AND a.tipo_alerta = ?';
      params.push(tipo_alerta);
    }

    query += ' ORDER BY a.fecha_alerta DESC';

    const [alertas] = await db.query(query, params);

    res.json({
      success: true,
      data: alertas,
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const createAlerta = async (req, res) => {
  try {
    const { nodo_id, tipo_alerta, severidad, titulo, descripcion } = req.body;

    if (!nodo_id || !tipo_alerta || !severidad || !titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Nodo, tipo de alerta, severidad, título y descripción son requeridos',
      });
    }

    const [result] = await db.query(
      `INSERT INTO alertas_red (nodo_id, tipo_alerta, severidad, titulo, descripcion)
       VALUES (?, ?, ?, ?, ?)`,
      [nodo_id, tipo_alerta, severidad, titulo, descripcion]
    );

    res.status(201).json({
      success: true,
      message: 'Alerta creada correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const updateAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, solucion, resuelto_por } = req.body;

    const updates = [];
    const values = [];

    if (estado) {
      updates.push('estado = ?');
      values.push(estado);
    }

    if (solucion) {
      updates.push('solucion = ?');
      values.push(solucion);
    }

    if (resuelto_por) {
      updates.push('resuelto_por = ?');
      values.push(resuelto_por);
    }

    if (estado === 'Resuelta' || estado === 'Cerrada') {
      updates.push('fecha_resolucion = NOW()');
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay datos para actualizar',
      });
    }

    values.push(id);
    await db.query(`UPDATE alertas_red SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({
      success: true,
      message: 'Alerta actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// MÉTRICAS DE RED (para IA)
// ============================================

export const registrarMetrica = async (req, res) => {
  try {
    const {
      nodo_id,
      ancho_banda_utilizado,
      latencia_promedio,
      paquetes_perdidos,
      uptime_percentaje,
      conexiones_activas,
      temperatura_equipo,
    } = req.body;

    if (!nodo_id) {
      return res.status(400).json({
        success: false,
        message: 'Nodo ID es requerido',
      });
    }

    const [result] = await db.query(
      `INSERT INTO metricas_red (
        nodo_id, ancho_banda_utilizado, latencia_promedio,
        paquetes_perdidos, uptime_percentaje, conexiones_activas, temperatura_equipo
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nodo_id,
        ancho_banda_utilizado || null,
        latencia_promedio || null,
        paquetes_perdidos || null,
        uptime_percentaje || null,
        conexiones_activas || null,
        temperatura_equipo || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Métrica registrada correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al registrar métrica:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const getMetricasNodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin, limite = 100 } = req.query;

    let query = 'SELECT * FROM metricas_red WHERE nodo_id = ?';
    const params = [id];

    if (fecha_inicio) {
      query += ' AND fecha_hora >= ?';
      params.push(fecha_inicio);
    }

    if (fecha_fin) {
      query += ' AND fecha_hora <= ?';
      params.push(fecha_fin);
    }

    query += ' ORDER BY fecha_hora DESC LIMIT ?';
    params.push(parseInt(limite));

    const [metricas] = await db.query(query, params);

    res.json({
      success: true,
      data: metricas,
    });
  } catch (error) {
    console.error('Error al obtener métricas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// DASHBOARD DE REDES
// ============================================

export const getDashboardRedes = async (req, res) => {
  try {
    // Estadísticas generales
    const [totalNodos] = await db.query('SELECT COUNT(*) as total FROM nodos_red');
    const [nodosOperativos] = await db.query(
      "SELECT COUNT(*) as total FROM nodos_red WHERE estado = 'Operativo'"
    );
    const [alertasCriticas] = await db.query(
      "SELECT COUNT(*) as total FROM alertas_red WHERE severidad = 'Crítico' AND estado IN ('Abierta', 'En Proceso')"
    );
    const [alertasAbiertas] = await db.query(
      "SELECT COUNT(*) as total FROM alertas_red WHERE estado IN ('Abierta', 'En Proceso')"
    );

    // Nodos por tipo
    const [nodosPorTipo] = await db.query(
      'SELECT tipo, COUNT(*) as cantidad FROM nodos_red GROUP BY tipo'
    );

    // Alertas por severidad
    const [alertasPorSeveridad] = await db.query(
      `SELECT severidad, COUNT(*) as cantidad
       FROM alertas_red
       WHERE estado IN ('Abierta', 'En Proceso')
       GROUP BY severidad`
    );

    res.json({
      success: true,
      data: {
        total_nodos: totalNodos[0].total,
        nodos_operativos: nodosOperativos[0].total,
        alertas_criticas: alertasCriticas[0].total,
        alertas_abiertas: alertasAbiertas[0].total,
        nodos_por_tipo: nodosPorTipo,
        alertas_por_severidad: alertasPorSeveridad,
      },
    });
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

