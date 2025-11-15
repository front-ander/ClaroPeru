# 🚀 Módulos Avanzados Claro - Sistema de Gestión Integral

## 📋 Descripción

Sistema modular avanzado para Claro Perú que incluye **CRM**, **Gestión de Redes**, **Facturación**, **Analytics con IA** y **Ciberseguridad**. Estos módulos se integran con el sistema existente de asistencia QR sin modificar su funcionalidad.

---

## 🗄️ Base de Datos

### Instalación

1. Ejecuta el script SQL para crear las tablas:
```bash
mysql -u root -p asistencia_qr < database_modules_claro.sql
```

O importa el archivo `database_modules_claro.sql` desde tu cliente MySQL.

### Estructura de Módulos

#### 1. **CRM (Customer Relationship Management)**
- `segmentos_cliente` - Segmentos (Personas, Empresas, Pymes)
- `clientes` - Base de datos de clientes
- `servicios` - Catálogo de servicios/productos
- `contratos` - Contratos y suscripciones
- `tickets_soporte` - Sistema de tickets de soporte

#### 2. **Gestión de Redes**
- `nodos_red` - Nodos FTTH, 5G, 4G, Satelital
- `alertas_red` - Alertas y notificaciones de red
- `metricas_red` - Métricas para análisis con IA

#### 3. **Facturación**
- `facturas` - Facturas electrónicas
- `factura_detalles` - Detalles de facturación
- `pagos` - Registro de pagos

#### 4. **Analytics**
- `reportes_analytics` - Reportes personalizados
- `predicciones_ia` - Predicciones con Inteligencia Artificial

#### 5. **Ciberseguridad**
- `incidentes_seguridad` - Incidentes de seguridad
- `auditorias_seguridad` - Logs de auditoría

---

## 🔌 API Endpoints

### CRM (`/api/crm`)
- `GET /segmentos` - Listar segmentos
- `GET /servicios` - Listar servicios
- `GET /clientes` - Listar clientes
- `GET /clientes/:id` - Obtener cliente
- `POST /clientes` - Crear cliente
- `PUT /clientes/:id` - Actualizar cliente
- `GET /contratos` - Listar contratos
- `POST /contratos` - Crear contrato
- `GET /tickets` - Listar tickets
- `POST /tickets` - Crear ticket

### Redes (`/api/redes`)
- `GET /dashboard` - Dashboard de redes
- `GET /nodos` - Listar nodos
- `GET /nodos/:id` - Obtener nodo
- `POST /nodos` - Crear nodo
- `PUT /nodos/:id` - Actualizar nodo
- `GET /alertas` - Listar alertas
- `POST /alertas` - Crear alerta
- `PUT /alertas/:id` - Actualizar alerta
- `POST /metricas` - Registrar métrica
- `GET /nodos/:id/metricas` - Métricas de nodo

### Facturación (`/api/facturacion`)
- `GET /dashboard` - Dashboard de facturación
- `GET /facturas` - Listar facturas
- `GET /facturas/:id` - Obtener factura
- `POST /facturas` - Crear factura
- `PUT /facturas/:id/estado` - Actualizar estado
- `POST /pagos` - Registrar pago

### Analytics (`/api/analytics`)
- `GET /dashboard` - Dashboard analytics
- `POST /predicciones` - Crear predicción IA
- `GET /predicciones` - Listar predicciones
- `GET /tendencias-ventas` - Tendencias de ventas
- `GET /analisis-churn` - Análisis de pérdida de clientes

### Ciberseguridad (`/api/ciberseguridad`)
- `GET /dashboard` - Dashboard de seguridad
- `GET /incidentes` - Listar incidentes
- `GET /incidentes/:id` - Obtener incidente
- `POST /incidentes` - Crear incidente
- `PUT /incidentes/:id` - Actualizar incidente
- `POST /auditorias` - Registrar auditoría
- `GET /auditorias` - Listar auditorías

---

## 🎨 Frontend

### APIs Disponibles

Todas las APIs están disponibles en `frontend/src/services/api.js`:

```javascript
import { crmAPI, redesAPI, facturacionAPI, analyticsAPI, ciberseguridadAPI } from '../services/api';
```

### Ejemplo de Uso

```javascript
// Obtener clientes
const clientes = await crmAPI.getAllClientes({ segmento: 1, estado: 'Activo' });

// Crear contrato
await crmAPI.createContrato({
  cliente_id: 1,
  servicio_id: 1,
  numero_contrato: 'CONT-001',
  fecha_inicio: '2024-01-01',
  precio_mensual: 89.90
});

// Dashboard de redes
const dashboard = await redesAPI.getDashboard();

// Crear factura
await facturacionAPI.createFactura({
  cliente_id: 1,
  numero_factura: 'F001-000001',
  serie: 'F001',
  numero_correlativo: 1,
  fecha_emision: '2024-01-01',
  fecha_vencimiento: '2024-01-15',
  detalles: [
    {
      servicio_id: 1,
      descripcion: 'Internet Fibra Óptica 100 Mbps',
      cantidad: 1,
      precio_unitario: 89.90,
      descuento: 0
    }
  ]
});
```

---

## 🚀 Características Principales

### 1. CRM
- ✅ Gestión completa de clientes por segmento
- ✅ Catálogo de servicios
- ✅ Contratos y suscripciones
- ✅ Sistema de tickets de soporte
- ✅ Seguimiento de estado de clientes

### 2. Gestión de Redes
- ✅ Monitoreo de nodos FTTH/5G/4G
- ✅ Sistema de alertas inteligente
- ✅ Métricas en tiempo real
- ✅ Dashboard de estado de red
- ✅ Preparado para IA predictiva

### 3. Facturación
- ✅ Facturación electrónica
- ✅ Gestión de pagos
- ✅ Estados de factura
- ✅ Dashboard financiero
- ✅ Análisis de cobranza

### 4. Analytics
- ✅ Dashboard ejecutivo
- ✅ Predicciones con IA
- ✅ Análisis de tendencias
- ✅ Análisis de churn (pérdida de clientes)
- ✅ Reportes personalizados

### 5. Ciberseguridad
- ✅ Gestión de incidentes
- ✅ Sistema de auditorías
- ✅ Monitoreo de accesos
- ✅ Detección de actividad sospechosa
- ✅ Dashboard de seguridad

---

## 🔒 Seguridad

- Todas las rutas requieren autenticación JWT
- Rutas administrativas requieren rol `admin`
- Sistema de auditorías para rastrear acciones
- Validación de datos en backend

---

## 📊 Integración con IA

Los módulos están preparados para integración con IA:

1. **Predicciones**: Tabla `predicciones_ia` para almacenar resultados
2. **Métricas de Red**: Datos históricos para machine learning
3. **Análisis de Churn**: Datos para predecir pérdida de clientes
4. **Alertas Inteligentes**: Sistema de alertas basado en patrones

---

## 🛠️ Próximos Pasos

1. **Crear componentes React** para cada módulo
2. **Integrar gráficos** (Chart.js, Recharts)
3. **Implementar IA** para predicciones
4. **Agregar notificaciones** en tiempo real
5. **Exportar reportes** a PDF/Excel
6. **Dashboard unificado** con todos los módulos

---

## 📝 Notas

- ✅ **No modifica** el sistema de asistencia QR existente
- ✅ **Modular**: Cada módulo es independiente
- ✅ **Escalable**: Fácil agregar nuevas funcionalidades
- ✅ **Documentado**: Código comentado y estructurado

---

## 👨‍💻 Desarrollo

Para agregar nuevos módulos:

1. Crear tablas en `database_modules_claro.sql`
2. Crear controlador en `backend/controllers/`
3. Crear rutas en `backend/routes/`
4. Agregar rutas en `backend/server.js`
5. Agregar APIs en `frontend/src/services/api.js`
6. Crear componentes React en `frontend/src/pages/`

---

**Desarrollado para Claro Perú**  
**Sistema de Gestión Integral v1.0**

