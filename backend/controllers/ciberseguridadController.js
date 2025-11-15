import db from '../config/database.js';

// ============================================
// INCIDENTES DE SEGURIDAD
// ============================================

export const getAllIncidentes = async (req, res) => {
  try {
    const { tipo_incidente, severidad, estado } = req.query;
    let query = `
      SELECT i.*, a.nombre as asignado_nombre
      FROM incidentes_seguridad i
      LEFT JOIN administradores a ON i.asignado_a = a.id
      WHERE 1=1
    `;
    const params = [];

    if (tipo_incidente) {
      query += ' AND i.tipo_incidente = ?';
      params.push(tipo_incidente);
    }

    if (severidad) {
      query += ' AND i.severidad = ?';
      params.push(severidad);
    }

    if (estado) {
      query += ' AND i.estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY i.fecha_deteccion DESC';

    const [incidentes] = await db.query(query, params);

    res.json({
      success: true,
      data: incidentes,
    });
  } catch (error) {
    console.error('Error al obtener incidentes:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const getIncidenteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [incidentes] = await db.query(
      `SELECT i.*, a.nombre as asignado_nombre
       FROM incidentes_seguridad i
       LEFT JOIN administradores a ON i.asignado_a = a.id
       WHERE i.id = ?`,
      [id]
    );

    if (incidentes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Incidente no encontrado',
      });
    }

    res.json({
      success: true,
      data: incidentes[0],
    });
  } catch (error) {
    console.error('Error al obtener incidente:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const createIncidente = async (req, res) => {
  try {
    const {
      codigo_incidente,
      tipo_incidente,
      severidad,
      titulo,
      descripcion,
      origen,
      ip_origen,
      asignado_a,
    } = req.body;

    if (!codigo_incidente || !tipo_incidente || !severidad || !titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Código, tipo, severidad, título y descripción son requeridos',
      });
    }

    const [result] = await db.query(
      `INSERT INTO incidentes_seguridad (
        codigo_incidente, tipo_incidente, severidad, titulo,
        descripcion, origen, ip_origen, asignado_a
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo_incidente,
        tipo_incidente,
        severidad,
        titulo,
        descripcion,
        origen || null,
        ip_origen || null,
        asignado_a || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Incidente creado correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al crear incidente:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const updateIncidente = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, acciones_tomadas, recomendaciones, asignado_a } = req.body;

    const updates = [];
    const values = [];

    if (estado) {
      updates.push('estado = ?');
      values.push(estado);
    }

    if (acciones_tomadas) {
      updates.push('acciones_tomadas = ?');
      values.push(acciones_tomadas);
    }

    if (recomendaciones) {
      updates.push('recomendaciones = ?');
      values.push(recomendaciones);
    }

    if (asignado_a) {
      updates.push('asignado_a = ?');
      values.push(asignado_a);
    }

    if (estado === 'Resuelto' || estado === 'Cerrado') {
      updates.push('fecha_resolucion = NOW()');
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay datos para actualizar',
      });
    }

    values.push(id);
    await db.query(`UPDATE incidentes_seguridad SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({
      success: true,
      message: 'Incidente actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar incidente:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// AUDITORÍAS DE SEGURIDAD
// ============================================

export const registrarAuditoria = async (req, res) => {
  try {
    const {
      tipo_auditoria,
      entidad_tipo,
      entidad_id,
      accion,
      usuario_id,
      ip_origen,
      resultado,
      detalles,
    } = req.body;

    if (!tipo_auditoria || !accion || !resultado) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de auditoría, acción y resultado son requeridos',
      });
    }

    const [result] = await db.query(
      `INSERT INTO auditorias_seguridad (
        tipo_auditoria, entidad_tipo, entidad_id, accion,
        usuario_id, ip_origen, resultado, detalles
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipo_auditoria,
        entidad_tipo || null,
        entidad_id || null,
        accion,
        usuario_id || null,
        ip_origen || null,
        resultado,
        detalles ? JSON.stringify(detalles) : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Auditoría registrada correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al registrar auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const getAuditorias = async (req, res) => {
  try {
    const { tipo_auditoria, resultado, usuario_id, fecha_inicio, fecha_fin, limite = 100 } = req.query;
    let query = `
      SELECT a.*, u.nombre as usuario_nombre
      FROM auditorias_seguridad a
      LEFT JOIN administradores u ON a.usuario_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (tipo_auditoria) {
      query += ' AND a.tipo_auditoria = ?';
      params.push(tipo_auditoria);
    }

    if (resultado) {
      query += ' AND a.resultado = ?';
      params.push(resultado);
    }

    if (usuario_id) {
      query += ' AND a.usuario_id = ?';
      params.push(usuario_id);
    }

    if (fecha_inicio) {
      query += ' AND a.fecha_auditoria >= ?';
      params.push(fecha_inicio);
    }

    if (fecha_fin) {
      query += ' AND a.fecha_auditoria <= ?';
      params.push(fecha_fin);
    }

    query += ' ORDER BY a.fecha_auditoria DESC LIMIT ?';
    params.push(parseInt(limite));

    const [auditorias] = await db.query(query, params);

    // Parsear detalles JSON si existen
    const auditoriasParsed = auditorias.map((aud) => ({
      ...aud,
      detalles: aud.detalles ? JSON.parse(aud.detalles) : null,
    }));

    res.json({
      success: true,
      data: auditoriasParsed,
    });
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// DASHBOARD DE CIBERSEGURIDAD
// ============================================

export const getDashboardCiberseguridad = async (req, res) => {
  try {
    // Incidentes activos
    const [incidentesActivos] = await db.query(
      "SELECT COUNT(*) as total FROM incidentes_seguridad WHERE estado IN ('Detectado', 'En Investigación')"
    );

    // Incidentes críticos
    const [incidentesCriticos] = await db.query(
      "SELECT COUNT(*) as total FROM incidentes_seguridad WHERE severidad = 'Crítica' AND estado IN ('Detectado', 'En Investigación')"
    );

    // Incidentes por tipo
    const [incidentesPorTipo] = await db.query(
      `SELECT tipo_incidente, COUNT(*) as cantidad
       FROM incidentes_seguridad
       WHERE fecha_deteccion >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY tipo_incidente`
    );

    // Intentos de acceso fallidos (últimas 24 horas)
    const [accesosFallidos] = await db.query(
      `SELECT COUNT(*) as total
       FROM auditorias_seguridad
       WHERE tipo_auditoria = 'Acceso'
       AND resultado = 'Fallido'
       AND fecha_auditoria >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );

    // Actividad sospechosa (múltiples intentos fallidos desde misma IP)
    const [actividadSospechosa] = await db.query(
      `SELECT ip_origen, COUNT(*) as intentos
       FROM auditorias_seguridad
       WHERE tipo_auditoria = 'Acceso'
       AND resultado = 'Fallido'
       AND fecha_auditoria >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
       GROUP BY ip_origen
       HAVING intentos >= 5
       ORDER BY intentos DESC`
    );

    res.json({
      success: true,
      data: {
        incidentes_activos: incidentesActivos[0].total,
        incidentes_criticos: incidentesCriticos[0].total,
        incidentes_por_tipo: incidentesPorTipo,
        accesos_fallidos_24h: accesosFallidos[0].total,
        actividad_sospechosa: actividadSospechosa,
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

