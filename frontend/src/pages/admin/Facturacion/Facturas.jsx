import { useEffect, useState } from 'react';
import { facturacionAPI, crmAPI } from '../../../services/api';
import { FileText, DollarSign, Calendar, CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';

export const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cliente_id: '',
    numero_factura: '',
    serie: 'F001',
    numero_correlativo: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    detalles: [{ servicio_id: '', descripcion: '', cantidad: 1, precio_unitario: '', descuento: 0 }],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [facturasRes, dashboardRes, clientesRes, serviciosRes] = await Promise.all([
        facturacionAPI.getAllFacturas(),
        facturacionAPI.getDashboard(),
        crmAPI.getAllClientes(),
        crmAPI.getServicios({ activo: true }),
      ]);
      setFacturas(facturasRes.data.data);
      setDashboard(dashboardRes.data.data);
      setClientes(clientesRes.data.data);
      setServicios(serviciosRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calcular fecha de vencimiento si no está definida (15 días después)
      if (!formData.fecha_vencimiento) {
        const fecha = new Date(formData.fecha_emision);
        fecha.setDate(fecha.getDate() + 15);
        formData.fecha_vencimiento = fecha.toISOString().split('T')[0];
      }

      await facturacionAPI.createFactura(formData);
      await loadData();
      handleCloseModal();
      alert('Factura creada correctamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al crear factura');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      cliente_id: '',
      numero_factura: '',
      serie: 'F001',
      numero_correlativo: '',
      fecha_emision: new Date().toISOString().split('T')[0],
      fecha_vencimiento: '',
      detalles: [{ servicio_id: '', descripcion: '', cantidad: 1, precio_unitario: '', descuento: 0 }],
    });
  };

  const addDetalle = () => {
    setFormData({
      ...formData,
      detalles: [...formData.detalles, { servicio_id: '', descripcion: '', cantidad: 1, precio_unitario: '', descuento: 0 }],
    });
  };

  const removeDetalle = (index) => {
    const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
    setFormData({ ...formData, detalles: nuevosDetalles });
  };

  const updateDetalle = (index, field, value) => {
    const nuevosDetalles = [...formData.detalles];
    nuevosDetalles[index][field] = value;
    
    // Si cambia el servicio, actualizar descripción y precio
    if (field === 'servicio_id' && value) {
      const servicio = servicios.find((s) => s.id == value);
      if (servicio) {
        nuevosDetalles[index].descripcion = servicio.nombre;
        nuevosDetalles[index].precio_unitario = servicio.precio_base;
      }
    }
    
    setFormData({ ...formData, detalles: nuevosDetalles });
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-PE');
  };

  const formatMoneda = (monto) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto);
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Pagada':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pendiente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Vencida':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
          <p className="text-gray-600 mt-2">Gestión de facturas electrónicas y pagos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nueva Factura
        </button>
      </div>

      {/* Dashboard */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Facturado</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatMoneda(dashboard.total_facturado)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.facturas_pendientes.cantidad}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatMoneda(dashboard.facturas_pendientes.monto)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencidas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.facturas_vencidas.cantidad}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatMoneda(dashboard.facturas_vencidas.monto)}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pagadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.facturas_pagadas.cantidad}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatMoneda(dashboard.facturas_pagadas.monto)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de facturas */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : facturas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay facturas registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Número Factura</th>
                  <th>Cliente</th>
                  <th>Fecha Emisión</th>
                  <th>Fecha Vencimiento</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold">{factura.numero_factura}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{factura.cliente_nombre}</p>
                        <p className="text-xs text-gray-500">{factura.cliente_documento}</p>
                      </div>
                    </td>
                    <td>{formatFecha(factura.fecha_emision)}</td>
                    <td>{formatFecha(factura.fecha_vencimiento)}</td>
                    <td className="font-semibold">{formatMoneda(factura.total)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(factura.estado)}
                        <span
                          className={`badge ${
                            factura.estado === 'Pagada'
                              ? 'badge-success'
                              : factura.estado === 'Vencida'
                              ? 'badge-danger'
                              : 'badge-warning'
                          }`}
                        >
                          {factura.estado}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear Factura */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={handleCloseModal} />
            <div className="relative bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nueva Factura</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente *
                    </label>
                    <select
                      value={formData.cliente_id}
                      onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Seleccionar cliente...</option>
                      {clientes.filter((c) => c.estado === 'Activo').map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.razon_social} - {cliente.numero_documento}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número Factura *
                    </label>
                    <input
                      type="text"
                      value={formData.numero_factura}
                      onChange={(e) => setFormData({ ...formData, numero_factura: e.target.value })}
                      className="input"
                      placeholder="F001-000001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serie *
                    </label>
                    <input
                      type="text"
                      value={formData.serie}
                      onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número Correlativo *
                    </label>
                    <input
                      type="number"
                      value={formData.numero_correlativo}
                      onChange={(e) => setFormData({ ...formData, numero_correlativo: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Emisión *
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_emision}
                      onChange={(e) => setFormData({ ...formData, fecha_emision: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Vencimiento
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_vencimiento}
                      onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                {/* Detalles */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Detalles de Factura</h3>
                    <button
                      type="button"
                      onClick={addDetalle}
                      className="btn btn-secondary text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Servicio
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.detalles.map((detalle, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Servicio *
                            </label>
                            <select
                              value={detalle.servicio_id}
                              onChange={(e) => updateDetalle(index, 'servicio_id', e.target.value)}
                              className="input text-sm"
                              required
                            >
                              <option value="">Seleccionar...</option>
                              {servicios.map((servicio) => (
                                <option key={servicio.id} value={servicio.id}>
                                  {servicio.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Descripción *
                            </label>
                            <input
                              type="text"
                              value={detalle.descripcion}
                              onChange={(e) => updateDetalle(index, 'descripcion', e.target.value)}
                              className="input text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Cantidad *
                            </label>
                            <input
                              type="number"
                              value={detalle.cantidad}
                              onChange={(e) => updateDetalle(index, 'cantidad', e.target.value)}
                              className="input text-sm"
                              min="1"
                              step="0.01"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Precio Unit. *
                            </label>
                            <input
                              type="number"
                              value={detalle.precio_unitario}
                              onChange={(e) => updateDetalle(index, 'precio_unitario', e.target.value)}
                              className="input text-sm"
                              step="0.01"
                              required
                            />
                          </div>

                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Descuento
                              </label>
                              <input
                                type="number"
                                value={detalle.descuento}
                                onChange={(e) => updateDetalle(index, 'descuento', e.target.value || 0)}
                                className="input text-sm"
                                step="0.01"
                                min="0"
                              />
                            </div>
                            {formData.detalles.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeDetalle(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Factura
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

