-- Base de datos para Módulos Avanzados de Claro
-- Sistema de Gestión Integral con CRM, Redes, Facturación, Analytics y Ciberseguridad

USE asistencia_qr;

-- ============================================
-- MÓDULO 1: CRM - GESTIÓN DE CLIENTES
-- ============================================

-- Tabla de Segmentos de Cliente
CREATE TABLE IF NOT EXISTS segmentos_cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    tipo ENUM('Personas', 'Empresas', 'Pymes') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    segmento_id INT NOT NULL,
    tipo_documento ENUM('DNI', 'RUC', 'CE', 'PASAPORTE') NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    distrito VARCHAR(100),
    provincia VARCHAR(100),
    departamento VARCHAR(100),
    estado ENUM('Activo', 'Inactivo', 'Prospecto', 'Suspendido') DEFAULT 'Prospecto',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (segmento_id) REFERENCES segmentos_cliente(id),
    INDEX idx_documento (numero_documento),
    INDEX idx_estado (estado),
    INDEX idx_segmento (segmento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Servicios/Productos
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    categoria ENUM('Movil', 'Fijo', 'Internet', 'TV', 'Streaming', 'Cloud', 'Seguridad', 'IoT', 'Otros') NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10, 2) NOT NULL,
    precio_promocional DECIMAL(10, 2),
    tipo_servicio ENUM('Recurrente', 'Pago Único', 'Por Uso') DEFAULT 'Recurrente',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Contratos/Suscripciones
CREATE TABLE IF NOT EXISTS contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    servicio_id INT NOT NULL,
    numero_contrato VARCHAR(50) NOT NULL UNIQUE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado ENUM('Activo', 'Suspendido', 'Cancelado', 'Vencido') DEFAULT 'Activo',
    precio_mensual DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(5, 2) DEFAULT 0,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_numero (numero_contrato)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Tickets de Soporte
CREATE TABLE IF NOT EXISTS tickets_soporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    contrato_id INT,
    numero_ticket VARCHAR(50) NOT NULL UNIQUE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria ENUM('Técnico', 'Facturación', 'Ventas', 'Reclamo', 'Consulta', 'Otros') NOT NULL,
    prioridad ENUM('Baja', 'Media', 'Alta', 'Crítica') DEFAULT 'Media',
    estado ENUM('Abierto', 'En Proceso', 'En Espera', 'Resuelto', 'Cerrado') DEFAULT 'Abierto',
    asignado_a INT,
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    solucion TEXT,
    satisfaccion_cliente INT CHECK (satisfaccion_cliente BETWEEN 1 AND 5),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (contrato_id) REFERENCES contratos(id),
    FOREIGN KEY (asignado_a) REFERENCES administradores(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MÓDULO 2: GESTIÓN DE REDES
-- ============================================

-- Tabla de Nodos de Red
CREATE TABLE IF NOT EXISTS nodos_red (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('FTTH', '5G', '4G', 'Satelital', 'Híbrido') NOT NULL,
    ubicacion_lat DECIMAL(10, 8),
    ubicacion_lng DECIMAL(11, 8),
    direccion TEXT,
    distrito VARCHAR(100),
    provincia VARCHAR(100),
    capacidad_maxima INT,
    capacidad_utilizada INT DEFAULT 0,
    estado ENUM('Operativo', 'Mantenimiento', 'Fuera de Servicio', 'En Construcción') DEFAULT 'En Construcción',
    fecha_instalacion DATE,
    fecha_ultimo_mantenimiento DATE,
    proximo_mantenimiento DATE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Alertas de Red
CREATE TABLE IF NOT EXISTS alertas_red (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nodo_id INT NOT NULL,
    tipo_alerta ENUM('Saturación', 'Falla', 'Mantenimiento', 'Rendimiento', 'Seguridad') NOT NULL,
    severidad ENUM('Info', 'Advertencia', 'Error', 'Crítico') NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado ENUM('Abierta', 'En Proceso', 'Resuelta', 'Cerrada') DEFAULT 'Abierta',
    fecha_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    resuelto_por INT,
    solucion TEXT,
    FOREIGN KEY (nodo_id) REFERENCES nodos_red(id) ON DELETE CASCADE,
    FOREIGN KEY (resuelto_por) REFERENCES administradores(id),
    INDEX idx_nodo (nodo_id),
    INDEX idx_estado (estado),
    INDEX idx_severidad (severidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Métricas de Red (para análisis con IA)
CREATE TABLE IF NOT EXISTS metricas_red (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nodo_id INT NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    ancho_banda_utilizado DECIMAL(10, 2),
    latencia_promedio DECIMAL(10, 2),
    paquetes_perdidos DECIMAL(5, 2),
    uptime_percentaje DECIMAL(5, 2),
    conexiones_activas INT,
    temperatura_equipo DECIMAL(5, 2),
    FOREIGN KEY (nodo_id) REFERENCES nodos_red(id) ON DELETE CASCADE,
    INDEX idx_nodo_fecha (nodo_id, fecha_hora),
    INDEX idx_fecha (fecha_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MÓDULO 3: FACTURACIÓN
-- ============================================

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    contrato_id INT,
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    serie VARCHAR(10) NOT NULL,
    numero_correlativo INT NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    igv DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('Pendiente', 'Pagada', 'Vencida', 'Anulada', 'En Proceso') DEFAULT 'Pendiente',
    metodo_pago ENUM('Efectivo', 'Transferencia', 'Tarjeta', 'Yape', 'Plin', 'Otros'),
    fecha_pago DATE,
    codigo_barras VARCHAR(255),
    qr_pago TEXT,
    archivo_pdf VARCHAR(255),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (contrato_id) REFERENCES contratos(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_vencimiento (fecha_vencimiento),
    INDEX idx_numero (numero_factura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Detalles de Factura
CREATE TABLE IF NOT EXISTS factura_detalles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    factura_id INT NOT NULL,
    servicio_id INT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    cantidad DECIMAL(10, 2) DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    INDEX idx_factura (factura_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Pagos
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    factura_id INT NOT NULL,
    numero_comprobante VARCHAR(50),
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('Efectivo', 'Transferencia', 'Tarjeta', 'Yape', 'Plin', 'Otros') NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referencia_pago VARCHAR(255),
    estado ENUM('Pendiente', 'Confirmado', 'Rechazado', 'Reembolsado') DEFAULT 'Pendiente',
    observaciones TEXT,
    FOREIGN KEY (factura_id) REFERENCES facturas(id),
    INDEX idx_factura (factura_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MÓDULO 4: ANÁLISIS DE DATOS (ANALYTICS)
-- ============================================

-- Tabla de Reportes Personalizados
CREATE TABLE IF NOT EXISTS reportes_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo_reporte ENUM('Ventas', 'Clientes', 'Redes', 'Facturación', 'Soporte', 'Personalizado') NOT NULL,
    descripcion TEXT,
    parametros JSON,
    creado_por INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creado_por) REFERENCES administradores(id),
    INDEX idx_tipo (tipo_reporte)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Predicciones IA
CREATE TABLE IF NOT EXISTS predicciones_ia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_prediccion ENUM('Demanda', 'Falla', 'Ventas', 'Churn', 'Mantenimiento') NOT NULL,
    entidad_tipo ENUM('Cliente', 'Nodo', 'Servicio', 'General') NOT NULL,
    entidad_id INT,
    valor_predicho DECIMAL(10, 2),
    confianza DECIMAL(5, 2),
    fecha_prediccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_objetivo DATE,
    observaciones TEXT,
    INDEX idx_tipo (tipo_prediccion),
    INDEX idx_fecha (fecha_prediccion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MÓDULO 5: CIBERSEGURIDAD
-- ============================================

-- Tabla de Incidentes de Seguridad
CREATE TABLE IF NOT EXISTS incidentes_seguridad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_incidente VARCHAR(50) NOT NULL UNIQUE,
    tipo_incidente ENUM('Malware', 'Phishing', 'DDoS', 'Acceso No Autorizado', 'Fuga de Datos', 'Otros') NOT NULL,
    severidad ENUM('Baja', 'Media', 'Alta', 'Crítica') NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    origen VARCHAR(255),
    ip_origen VARCHAR(45),
    estado ENUM('Detectado', 'En Investigación', 'Mitigado', 'Resuelto', 'Cerrado') DEFAULT 'Detectado',
    fecha_deteccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    asignado_a INT,
    acciones_tomadas TEXT,
    recomendaciones TEXT,
    FOREIGN KEY (asignado_a) REFERENCES administradores(id),
    INDEX idx_estado (estado),
    INDEX idx_severidad (severidad),
    INDEX idx_tipo (tipo_incidente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Auditorías de Seguridad
CREATE TABLE IF NOT EXISTS auditorias_seguridad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_auditoria ENUM('Acceso', 'Configuración', 'Compliance', 'Vulnerabilidad', 'Otros') NOT NULL,
    entidad_tipo VARCHAR(50),
    entidad_id INT,
    accion VARCHAR(255) NOT NULL,
    usuario_id INT,
    ip_origen VARCHAR(45),
    resultado ENUM('Exitoso', 'Fallido', 'Bloqueado') NOT NULL,
    detalles JSON,
    fecha_auditoria TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo_auditoria),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_auditoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar segmentos de cliente
INSERT INTO segmentos_cliente (nombre, descripcion, tipo) VALUES
('Personas', 'Clientes residenciales - servicios móviles y para el hogar', 'Personas'),
('Empresas', 'Empresas grandes con soluciones integrales', 'Empresas'),
('Pymes', 'Pequeñas y medianas empresas', 'Pymes');

-- Insertar servicios de ejemplo
INSERT INTO servicios (codigo, nombre, categoria, descripcion, precio_base, tipo_servicio) VALUES
('INT-FTTH-100', 'Internet Fibra Óptica 100 Mbps', 'Internet', 'Internet residencial FTTH 100 Mbps simétricos', 89.90, 'Recurrente'),
('INT-FTTH-200', 'Internet Fibra Óptica 200 Mbps', 'Internet', 'Internet residencial FTTH 200 Mbps simétricos', 129.90, 'Recurrente'),
('INT-FTTH-500', 'Internet Fibra Óptica 500 Mbps', 'Internet', 'Internet residencial FTTH 500 Mbps simétricos', 199.90, 'Recurrente'),
('MOV-5G-ILIM', 'Plan Móvil 5G Ilimitado', 'Movil', 'Plan móvil 5G con datos ilimitados', 149.90, 'Recurrente'),
('TV-PREMIUM', 'TV Premium + Liga 1', 'TV', 'Televisión premium con acceso a Liga 1', 59.90, 'Recurrente'),
('CLOUD-BASIC', 'Claro Cloud Básico', 'Cloud', 'Servicio cloud básico 100GB', 29.90, 'Recurrente'),
('SEG-CIBER', 'Ciberseguridad Empresarial', 'Seguridad', 'Solución de ciberseguridad para empresas', 299.90, 'Recurrente');

-- Crear índices adicionales para optimización
CREATE INDEX idx_clientes_segmento_estado ON clientes(segmento_id, estado);
CREATE INDEX idx_contratos_cliente_estado ON contratos(cliente_id, estado);
CREATE INDEX idx_facturas_cliente_estado ON facturas(cliente_id, estado);
CREATE INDEX idx_metricas_nodo_fecha ON metricas_red(nodo_id, fecha_hora);

