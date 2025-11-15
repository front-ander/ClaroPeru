import { useEffect, useState } from 'react';
import { crmAPI } from '../../../services/api';
import { Plus, FileText, Calendar, DollarSign, X } from 'lucide-react';

export const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cliente_id: '',
    servicio_id: '',
    numero_contrato: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    precio_mensual: '',
    descuento: 0,
    observaciones: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contratosRes, clientesRes, serviciosRes] = await Promise.all([
        crmAPI.getAllContratos(),
        crmAPI.getAllClientes(),
        crmAPI.getServicios({ activo: true }),
      ]);
      setContratos(contratosRes.data.data);
      setClientes(clientesRes.data.data);
      setServicios(serviciosRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        precio_mensual: parseFloat(formData.precio_mensual),
        descuento: parseFloat(formData.descuento) || 0,
        fecha_fin: formData.fecha_fin || null,
      };
      await crmAPI.createContrato(dataToSend);
      await loadData();
      handleCloseModal();
      alert('Contrato creado correctamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al crear contrato');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      cliente_id: '',
      servicio_id: '',
      numero_contrato: '',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
      precio_mensual: '',
      descuento: 0,
      observaciones: '',
    });
  };

  const handleServicioChange = (servicioId) => {
    const servicio = servicios.find((s) => s.id == servicioId);
    if (servicio) {
      setFormData({
        ...formData,
        servicio_id: servicioId,
        precio_mensual: servicio.precio_base,
      });
    } else {
      setFormData({ ...formData, servicio_id: servicioId });
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contratos y Suscripciones</h1>
          <p className="text-gray-600 mt-2">Gestiona los contratos de servicios de los clientes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Contrato
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contratos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{contratos.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {contratos.filter((c) => c.estado === 'Activo').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatMoneda(
                  contratos
                    .filter((c) => c.estado === 'Activo')
                    .reduce((sum, c) => sum + parseFloat(c.precio_mensual || 0), 0)
                )}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contratos Cancelados</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {contratos.filter((c) => c.estado === 'Cancelado').length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de contratos */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : contratos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay contratos registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Número Contrato</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Precio Mensual</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((contrato) => (
                  <tr key={contrato.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold">{contrato.numero_contrato}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{contrato.cliente_nombre}</p>
                        <p className="text-xs text-gray-500">{contrato.cliente_documento}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{contrato.servicio_nombre}</p>
                        <span className="badge badge-info text-xs">{contrato.servicio_categoria}</span>
                      </div>
                    </td>
                    <td>{formatFecha(contrato.fecha_inicio)}</td>
                    <td>{formatFecha(contrato.fecha_fin)}</td>
                    <td className="font-semibold">{formatMoneda(contrato.precio_mensual)}</td>
                    <td>
                      <span
                        className={`badge ${
                          contrato.estado === 'Activo'
                            ? 'badge-success'
                            : contrato.estado === 'Cancelado'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {contrato.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear Contrato */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={handleCloseModal} />
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nuevo Contrato</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Servicio *
                    </label>
                    <select
                      value={formData.servicio_id}
                      onChange={(e) => handleServicioChange(e.target.value)}
                      className="input"
                      required
                    >
                      <option value="">Seleccionar servicio...</option>
                      {servicios.map((servicio) => (
                        <option key={servicio.id} value={servicio.id}>
                          {servicio.nombre} - {formatMoneda(servicio.precio_base)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número Contrato *
                    </label>
                    <input
                      type="text"
                      value={formData.numero_contrato}
                      onChange={(e) => setFormData({ ...formData, numero_contrato: e.target.value })}
                      className="input"
                      placeholder="CONT-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Inicio *
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_fin}
                      onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Mensual *
                    </label>
                    <input
                      type="number"
                      value={formData.precio_mensual}
                      onChange={(e) => setFormData({ ...formData, precio_mensual: e.target.value })}
                      className="input"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descuento (%)
                    </label>
                    <input
                      type="number"
                      value={formData.descuento}
                      onChange={(e) => setFormData({ ...formData, descuento: e.target.value || 0 })}
                      className="input"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      value={formData.observaciones}
                      onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                      className="input"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Contrato
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

