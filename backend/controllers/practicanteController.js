import bcrypt from 'bcrypt';
import db from '../config/database.js';

// Listar todos los practicantes
export const getAllPracticantes = async (req, res) => {
  try {
    const [practicantes] = await db.query(
      'SELECT id, nombre, apellidos, documento, telefono, codigo, usuario, email, foto, activo, periodo, horario, turno, fecha_creacion FROM practicantes ORDER BY codigo ASC'
    );

    res.json({
      success: true,
      data: practicantes
    });
  } catch (error) {
    console.error('Error al listar practicantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener un practicante por ID
export const getPracticanteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [practicantes] = await db.query(
      'SELECT id, nombre, apellidos, documento, telefono, codigo, usuario, email, foto, activo FROM practicantes WHERE id = ?',
      [id]
    );

    if (practicantes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practicante no encontrado'
      });
    }

    res.json({
      success: true,
      data: practicantes[0]
    });
  } catch (error) {
    console.error('Error al obtener practicante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Crear nuevo practicante
export const createPracticante = async (req, res) => {
  try {
    const { 
      nombre, 
      apellidos, 
      documento, 
      telefono, 
      codigo, 
      email,
      periodo,
      horario,
      turno 
    } = req.body;

    if (!nombre || !apellidos || !documento || !codigo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellidos, documento y código son requeridos'
      });
    }

    // Verificar si el código ya existe
    const [existingCodigo] = await db.query(
      'SELECT id FROM practicantes WHERE codigo = ?',
      [codigo]
    );

    if (existingCodigo.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El código ya existe'
      });
    }

    // Verificar si el documento ya existe
    const [existingDoc] = await db.query(
      'SELECT id FROM practicantes WHERE documento = ?',
      [documento]
    );

    if (existingDoc.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El documento ya existe'
      });
    }

    // El usuario será el mismo que el código
    const usuario = codigo;
    // Contraseña por defecto: 123456
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const [result] = await db.query(
      'INSERT INTO practicantes (nombre, apellidos, documento, telefono, codigo, usuario, password, email, periodo, horario, turno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, documento, telefono, codigo, usuario, hashedPassword, email, periodo, horario, turno]
    );

    res.status(201).json({
      success: true,
      message: 'Practicante creado correctamente',
      data: { 
        id: result.insertId,
        usuario: usuario,
        password_default: defaultPassword
      }
    });
  } catch (error) {
    console.error('Error al crear practicante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Actualizar practicante
export const updatePracticante = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      apellidos, 
      documento, 
      telefono, 
      codigo, 
      email, 
      password, 
      activo,
      periodo,
      horario,
      turno 
    } = req.body;
    
    const updates = [];
    const values = [];

    if (nombre) {
      updates.push('nombre = ?');
      values.push(nombre);
    }
    if (apellidos) {
      updates.push('apellidos = ?');
      values.push(apellidos);
    }
    if (documento) {
      // Verificar que el documento no esté en uso por otro practicante
      const [existing] = await db.query(
        'SELECT id FROM practicantes WHERE documento = ? AND id != ?',
        [documento, id]
      );
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El documento ya está en uso'
        });
      }
      updates.push('documento = ?');
      values.push(documento);
    }
    if (telefono !== undefined) {
      updates.push('telefono = ?');
      values.push(telefono);
    }
    if (codigo) {
      // Verificar que el código no esté en uso por otro practicante
      const [existing] = await db.query(
        'SELECT id FROM practicantes WHERE codigo = ? AND id != ?',
        [codigo, id]
      );
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El código ya está en uso'
        });
      }
      updates.push('codigo = ?');
      values.push(codigo);
      updates.push('usuario = ?');
      values.push(codigo);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }
    if (activo !== undefined) {
      updates.push('activo = ?');
      values.push(activo);
    }
    if (periodo !== undefined) {
      updates.push('periodo = ?');
      values.push(periodo);
    }
    if (horario !== undefined) {
      updates.push('horario = ?');
      values.push(horario);
    }
    if (turno !== undefined) {
      updates.push('turno = ?');
      values.push(turno);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay datos para actualizar'
      });
    }

    values.push(id);

    await db.query(
      `UPDATE practicantes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Practicante actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar practicante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Eliminar practicante
export const deletePracticante = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM practicantes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Practicante eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar practicante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener perfil del practicante (para el propio practicante)
export const getMyProfile = async (req, res) => {
  try {
    const [practicantes] = await db.query(
      'SELECT id, nombre, apellidos, documento, telefono, codigo, usuario, email, foto FROM practicantes WHERE id = ? AND activo = TRUE',
      [req.user.id]
    );

    if (practicantes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practicante no encontrado'
      });
    }

    res.json({
      success: true,
      data: practicantes[0]
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Actualizar perfil del practicante (para el propio practicante)
export const updateMyProfile = async (req, res) => {
  try {
    const { nombre, apellidos, telefono, email, password, horario, turno } = req.body;
    const updates = [];
    const values = [];

    if (nombre) {
      updates.push('nombre = ?');
      values.push(nombre);
    }
    if (apellidos) {
      updates.push('apellidos = ?');
      values.push(apellidos);
    }
    if (telefono !== undefined) {
      updates.push('telefono = ?');
      values.push(telefono);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }
    if (horario !== undefined) {
      updates.push('horario = ?');
      values.push(horario);
    }
    if (turno !== undefined) {
      updates.push('turno = ?');
      values.push(turno);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay datos para actualizar'
      });
    }

    values.push(req.user.id);

    await db.query(
      `UPDATE practicantes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Buscar practicante por código QR
export const getPracticanteByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;

    const [practicantes] = await db.query(
      'SELECT id, nombre, apellidos, documento, codigo, foto FROM practicantes WHERE codigo = ? AND activo = TRUE',
      [codigo]
    );

    if (practicantes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practicante no encontrado'
      });
    }

    res.json({
      success: true,
      data: practicantes[0]
    });
  } catch (error) {
    console.error('Error al buscar practicante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
