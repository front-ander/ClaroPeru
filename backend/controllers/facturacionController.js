import db from '../config/database.js';

// ============================================
// FACTURAS
// ============================================

export const getAllFacturas = async (req, res) => {
  try {
    const { cliente_id, estado, fecha_inicio, fecha_fin } = req.query;
    let query = `
      SELECT f.*,
             c.razon_social as cliente_nombre,
             c.numero_documento as cliente_documento,
             co.numero_contrato
      FROM facturas f
      INNER JOIN clientes c ON f.cliente_id = c.id
      LEFT JOIN contratos co ON f.contrato_id = co.id
      WHERE 1=1
    `;
    const params = [];

    if (cliente_id) {
      query += ' AND f.cliente_id = ?';
      params.push(cliente_id);
    }

    if (estado) {
      query += ' AND f.estado = ?';
      params.push(estado);
    }

    if (fecha_inicio) {
      query += ' AND f.fecha_emision >= ?';
      params.push(fecha_inicio);
    }

    if (fecha_fin) {
      query += ' AND f.fecha_emision <= ?';
      params.push(fecha_fin);
    }

    query += ' ORDER BY f.fecha_emision DESC';

    const [facturas] = await db.query(query, params);

    res.json({
      success: true,
      data: facturas,
    });
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const getFacturaById = async (req, res) => {
  try {
    const { id } = req.params;

    const [facturas] = await db.query(
      `SELECT f.*,
              c.razon_social as cliente_nombre,
              c.numero_documento as cliente_documento,
              c.direccion as cliente_direccion,
              co.numero_contrato
       FROM facturas f
       INNER JOIN clientes c ON f.cliente_id = c.id
       LEFT JOIN contratos co ON f.contrato_id = co.id
       WHERE f.id = ?`,
      [id]
    );

    if (facturas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada',
      });
    }

    // Obtener detalles de la factura
    const [detalles] = await db.query(
      `SELECT fd.*, s.nombre as servicio_nombre, s.categoria
       FROM factura_detalles fd
       INNER JOIN servicios s ON fd.servicio_id = s.id
       WHERE fd.factura_id = ?`,
      [id]
    );

    // Obtener pagos
    const [pagos] = await db.query(
      'SELECT * FROM pagos WHERE factura_id = ? ORDER BY fecha_pago DESC',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...facturas[0],
        detalles,
        pagos,
      },
    });
  } catch (error) {
    console.error('Error al obtener factura:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const createFactura = async (req, res) => {
  try {
    const {
      cliente_id,
      contrato_id,
      numero_factura,
      serie,
      numero_correlativo,
      fecha_emision,
      fecha_vencimiento,
      detalles,
      observaciones,
    } = req.body;

    if (!cliente_id || !numero_factura || !serie || !numero_correlativo || !fecha_emision || !fecha_vencimiento || !detalles || detalles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos de factura',
      });
    }

    // Calcular totales
    let subtotal = 0;
    for (const detalle of detalles) {
      const cantidad = parseFloat(detalle.cantidad) || 1;
      const precio = parseFloat(detalle.precio_unitario) || 0;
      const descuento = parseFloat(detalle.descuento) || 0;
      subtotal += (cantidad * precio) - descuento;
    }

    const igv = subtotal * 0.18; // IGV 18%
    const total = subtotal + igv;

    // Crear factura
    const [result] = await db.query(
      `INSERT INTO facturas (
        cliente_id, contrato_id, numero_factura, serie, numero_correlativo,
        fecha_emision, fecha_vencimiento, subtotal, igv, total, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_id,
        contrato_id || null,
        numero_factura,
        serie,
        numero_correlativo,
        fecha_emision,
        fecha_vencimiento,
        subtotal,
        igv,
        total,
        observaciones || null,
      ]
    );

    const facturaId = result.insertId;

    // Crear detalles
    for (const detalle of detalles) {
      const cantidad = parseFloat(detalle.cantidad) || 1;
      const precio = parseFloat(detalle.precio_unitario) || 0;
      const descuento = parseFloat(detalle.descuento) || 0;
      const subtotalDetalle = (cantidad * precio) - descuento;

      await db.query(
        `INSERT INTO factura_detalles (
          factura_id, servicio_id, descripcion, cantidad,
          precio_unitario, descuento, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          facturaId,
          detalle.servicio_id,
          detalle.descripcion,
          cantidad,
          precio,
          descuento,
          subtotalDetalle,
        ]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Factura creada correctamente',
      data: { id: facturaId, total },
    });
  } catch (error) {
    console.error('Error al crear factura:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

export const updateFacturaEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, metodo_pago, fecha_pago, observaciones } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'Estado es requerido',
      });
    }

    const updates = ['estado = ?'];
    const values = [estado];

    if (metodo_pago) {
      updates.push('metodo_pago = ?');
      values.push(metodo_pago);
    }

    if (fecha_pago) {
      updates.push('fecha_pago = ?');
      values.push(fecha_pago);
    }

    if (observaciones) {
      updates.push('observaciones = ?');
      values.push(observaciones);
    }

    values.push(id);

    await db.query(`UPDATE facturas SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({
      success: true,
      message: 'Factura actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// PAGOS
// ============================================

export const registrarPago = async (req, res) => {
  try {
    const {
      factura_id,
      numero_comprobante,
      monto,
      metodo_pago,
      referencia_pago,
      observaciones,
    } = req.body;

    if (!factura_id || !monto || !metodo_pago) {
      return res.status(400).json({
        success: false,
        message: 'Factura, monto y método de pago son requeridos',
      });
    }

    const [result] = await db.query(
      `INSERT INTO pagos (
        factura_id, numero_comprobante, monto, metodo_pago,
        referencia_pago, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [factura_id, numero_comprobante || null, monto, metodo_pago, referencia_pago || null, observaciones || null]
    );

    // Actualizar estado de la factura si el pago es completo
    const [factura] = await db.query('SELECT total FROM facturas WHERE id = ?', [factura_id]);
    if (factura.length > 0) {
      const [pagos] = await db.query(
        'SELECT SUM(monto) as total_pagado FROM pagos WHERE factura_id = ? AND estado = "Confirmado"',
        [factura_id]
      );
      const totalPagado = parseFloat(pagos[0].total_pagado || 0) + parseFloat(monto);
      const totalFactura = parseFloat(factura[0].total);

      if (totalPagado >= totalFactura) {
        await db.query("UPDATE facturas SET estado = 'Pagada', fecha_pago = NOW() WHERE id = ?", [factura_id]);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Pago registrado correctamente',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

// ============================================
// DASHBOARD DE FACTURACIÓN
// ============================================

export const getDashboardFacturacion = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    let whereClause = '';
    const params = [];

    if (fecha_inicio && fecha_fin) {
      whereClause = 'WHERE fecha_emision BETWEEN ? AND ?';
      params.push(fecha_inicio, fecha_fin);
    }

    // Total facturado
    const [totalFacturado] = await db.query(
      `SELECT COALESCE(SUM(total), 0) as total FROM facturas ${whereClause}`,
      params
    );

    // Facturas pendientes
    const [facturasPendientes] = await db.query(
      `SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto
       FROM facturas
       WHERE estado = 'Pendiente' ${whereClause ? 'AND ' + whereClause.replace('WHERE', '') : ''}`,
      params
    );

    // Facturas vencidas
    const [facturasVencidas] = await db.query(
      `SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto
       FROM facturas
       WHERE estado = 'Vencida' ${whereClause ? 'AND ' + whereClause.replace('WHERE', '') : ''}`,
      params
    );

    // Facturas pagadas
    const [facturasPagadas] = await db.query(
      `SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto
       FROM facturas
       WHERE estado = 'Pagada' ${whereClause ? 'AND ' + whereClause.replace('WHERE', '') : ''}`,
      params
    );

    // Facturación por mes (últimos 6 meses)
    const [facturacionMensual] = await db.query(
      `SELECT 
        DATE_FORMAT(fecha_emision, '%Y-%m') as mes,
        COUNT(*) as cantidad,
        SUM(total) as total
       FROM facturas
       WHERE fecha_emision >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(fecha_emision, '%Y-%m')
       ORDER BY mes DESC`
    );

    res.json({
      success: true,
      data: {
        total_facturado: parseFloat(totalFacturado[0].total),
        facturas_pendientes: {
          cantidad: facturasPendientes[0].total,
          monto: parseFloat(facturasPendientes[0].monto),
        },
        facturas_vencidas: {
          cantidad: facturasVencidas[0].total,
          monto: parseFloat(facturasVencidas[0].monto),
        },
        facturas_pagadas: {
          cantidad: facturasPagadas[0].total,
          monto: parseFloat(facturasPagadas[0].monto),
        },
        facturacion_mensual: facturacionMensual,
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

