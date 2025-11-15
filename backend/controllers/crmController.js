import db from '../config/database.js';

// ============================================
// CLIENTES
// ============================================

export const getAllClientes = async (req, res) => {
  try {
    const { segmento, estado, search } = req.query;
    let query = `
      SELECT c.*, s.nombre as segmento_nombre, s.tipo as segmento_tipo
      FROM clientes c
      INNER JOIN segmentos_cliente s ON c.segmento_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (segmento) {
      query += ' AND c.segmento_id = ?';
      params.push(segmento);
    }

    if (estado) {
      query += ' AND c.estado = ?';
      params.push(estado);
    }

    if (search) {
      query += ' AND (c.razon_social LIKE ? OR c.numero_documento LIKE ? OR c.email LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY c.fecha_registro DESC';

    const [clientes] = await db.query(query, params);

    res.json({
      success: true,
      data: clientes,
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [clientes] = await db.query(
      `SELECT c.*, s.nombre as segmento_nombre, s.tipo as segmento_tipo
       FROM clientes c
       INNER JOIN segmentos_cliente s ON c.segmento_id = s.id
       WHERE c.id = ?`,
      [id]
    );

    if (clientes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado',
      });
    }

    // Obtener contratos del cliente
    const [contratos] = await db.query(
      `SELECT co.*, s.nombre as servicio_nombre, s.categoria
       FROM contratos co
       INNER JOIN servicios s ON co.servicio_id = s.id
       WHERE co.cliente_id = ?
       ORDER BY co.fecha_inicio DESC`,
      [id]
    );

    // Obtener tickets de soporte
    const [tickets] = await db.query(
      `SELECT * FROM tickets_soporte
       WHERE cliente_id = ?
       ORDER BY fecha_apertura DESC
       LIMIT 10`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...clientes[0],
        contratos,
        tickets,
      },
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const createCliente = async (req, res) => {
  try {
    const {
      segmento_id,
      tipo_documento,
      numero_documento,
      razon_social,
      nombre_comercial,
      email,
      telefono,
      direccion,
      distrito,
      provincia,
      departamento,
      estado,
    } = req.body;

    if (!segmento_id || !tipo_documento || !numero_documento || !razon_social) {
      return res.status(400).json({
        success: false,
        message: 'Segmento, tipo de documento, número de documento y razón social son requeridos',
      });
    }

    // Verificar si el documento ya existe
    const [existing] = await db.query(
      'SELECT id FROM clientes WHERE numero_documento = ?',
      [numero_documento]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El número de documento ya está registrado',
      });
    }

    const [result] = await db.query(
      `INSERT INTO clientes (
        segmento_id, tipo_documento, numero_documento, razon_social,
        nombre_comercial, email, telefono, direccion, distrito,
        provincia, departamento, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        segmento_id,
        tipo_documento,
        numero_documento,
        razon_social,
        nombre_comercial || null,
        email || null,
        telefono || null,
        direccion || null,
        distrito || null,
        provincia || null,
        departamento || null,
        estado || 'Prospecto',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Cliente creado correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];

    const allowedFields = [
      'segmento_id',
      'tipo_documento',
      'numero_documento',
      'razon_social',
      'nombre_comercial',
      'email',
      'telefono',
      'direccion',
      'distrito',
      'provincia',
      'departamento',
      'estado',
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

    await db.query(`UPDATE clientes SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({
      success: true,
      message: 'Cliente actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// CONTRATOS
// ============================================

export const getAllContratos = async (req, res) => {
  try {
    const { cliente_id, estado } = req.query;
    let query = `
      SELECT co.*, 
             c.razon_social as cliente_nombre,
             c.numero_documento as cliente_documento,
             s.nombre as servicio_nombre,
             s.categoria as servicio_categoria
      FROM contratos co
      INNER JOIN clientes c ON co.cliente_id = c.id
      INNER JOIN servicios s ON co.servicio_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (cliente_id) {
      query += ' AND co.cliente_id = ?';
      params.push(cliente_id);
    }

    if (estado) {
      query += ' AND co.estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY co.fecha_inicio DESC';

    const [contratos] = await db.query(query, params);

    res.json({
      success: true,
      data: contratos,
    });
  } catch (error) {
    console.error('Error al obtener contratos:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const createContrato = async (req, res) => {
  try {
    const {
      cliente_id,
      servicio_id,
      numero_contrato,
      fecha_inicio,
      fecha_fin,
      precio_mensual,
      descuento,
      observaciones,
    } = req.body;

    if (!cliente_id || !servicio_id || !numero_contrato || !fecha_inicio || !precio_mensual) {
      return res.status(400).json({
        success: false,
        message: 'Cliente, servicio, número de contrato, fecha de inicio y precio son requeridos',
      });
    }

    const [result] = await db.query(
      `INSERT INTO contratos (
        cliente_id, servicio_id, numero_contrato, fecha_inicio,
        fecha_fin, precio_mensual, descuento, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_id,
        servicio_id,
        numero_contrato,
        fecha_inicio,
        fecha_fin || null,
        precio_mensual,
        descuento || 0,
        observaciones || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Contrato creado correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al crear contrato:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// TICKETS DE SOPORTE
// ============================================

export const getAllTickets = async (req, res) => {
  try {
    const { cliente_id, estado, prioridad, categoria } = req.query;
    let query = `
      SELECT t.*,
             c.razon_social as cliente_nombre,
             co.numero_contrato,
             a.nombre as asignado_nombre
      FROM tickets_soporte t
      INNER JOIN clientes c ON t.cliente_id = c.id
      LEFT JOIN contratos co ON t.contrato_id = co.id
      LEFT JOIN administradores a ON t.asignado_a = a.id
      WHERE 1=1
    `;
    const params = [];

    if (cliente_id) {
      query += ' AND t.cliente_id = ?';
      params.push(cliente_id);
    }

    if (estado) {
      query += ' AND t.estado = ?';
      params.push(estado);
    }

    if (prioridad) {
      query += ' AND t.prioridad = ?';
      params.push(prioridad);
    }

    if (categoria) {
      query += ' AND t.categoria = ?';
      params.push(categoria);
    }

    query += ' ORDER BY t.fecha_apertura DESC';

    const [tickets] = await db.query(query, params);

    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const createTicket = async (req, res) => {
  try {
    const {
      cliente_id,
      contrato_id,
      numero_ticket,
      titulo,
      descripcion,
      categoria,
      prioridad,
      asignado_a,
    } = req.body;

    if (!cliente_id || !numero_ticket || !titulo || !descripcion || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Cliente, número de ticket, título, descripción y categoría son requeridos',
      });
    }

    const [result] = await db.query(
      `INSERT INTO tickets_soporte (
        cliente_id, contrato_id, numero_ticket, titulo,
        descripcion, categoria, prioridad, asignado_a
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_id,
        contrato_id || null,
        numero_ticket,
        titulo,
        descripcion,
        categoria,
        prioridad || 'Media',
        asignado_a || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Ticket creado correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// SEGMENTOS Y SERVICIOS
// ============================================

export const getSegmentos = async (req, res) => {
  try {
    const [segmentos] = await db.query('SELECT * FROM segmentos_cliente WHERE activo = TRUE ORDER BY nombre');
    res.json({ success: true, data: segmentos });
  } catch (error) {
    console.error('Error al obtener segmentos:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};

export const getServicios = async (req, res) => {
  try {
    const { categoria, activo } = req.query;
    let query = 'SELECT * FROM servicios WHERE 1=1';
    const params = [];

    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    if (activo !== undefined) {
      query += ' AND activo = ?';
      params.push(activo === 'true');
    }

    query += ' ORDER BY nombre';

    const [servicios] = await db.query(query, params);
    res.json({ success: true, data: servicios });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};

