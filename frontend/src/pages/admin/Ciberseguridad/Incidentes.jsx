import { useEffect, useState } from 'react';
import { ciberseguridadAPI } from '../../../services/api';
import { Shield, AlertTriangle, CheckCircle, Clock, XCircle, Plus, X } from 'lucide-react';

export const Incidentes = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    codigo_incidente: '',
    tipo_incidente: 'Malware',
    severidad: 'Media',
    titulo: '',
    descripcion: '',
    origen: '',
    ip_origen: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [incidentesRes, dashboardRes] = await Promise.all([
        ciberseguridadAPI.getAllIncidentes(),
        ciberseguridadAPI.getDashboard(),
      ]);
      setIncidentes(incidentesRes.data.data);
      setDashboard(dashboardRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ciberseguridadAPI.createIncidente(formData);
      setShowModal(false);
      setFormData({
        codigo_incidente: '',
        tipo_incidente: 'Malware',
        severidad: 'Media',
        titulo: '',
        descripcion: '',
        origen: '',
        ip_origen: '',
      });
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error al crear incidente:', error);
      alert('Error al crear el incidente');
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeveridadColor = (severidad) => {
    switch (severidad) {
      case 'Crítica':
        return 'badge-danger';
      case 'Alta':
        return 'badge-warning';
      case 'Media':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Malware':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Phishing':
        return <Shield className="w-4 h-4 text-orange-600" />;
      case 'DDoS':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ciberseguridad</h1>
          <p className="text-gray-600 mt-2">Gestión de incidentes y auditorías de seguridad</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Incidente
        </button>
      </div>

      {/* Dashboard */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Incidentes Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.incidentes_activos}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Incidentes Críticos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.incidentes_criticos}
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
                <p className="text-sm font-medium text-gray-600">Accesos Fallidos (24h)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.accesos_fallidos_24h}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actividad Sospechosa</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.actividad_sospechosa.length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de incidentes */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : incidentes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No hay incidentes registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Severidad</th>
                  <th>Estado</th>
                  <th>Fecha Detección</th>
                  <th>Asignado</th>
                </tr>
              </thead>
              <tbody>
                {incidentes.map((incidente) => (
                  <tr key={incidente.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold">
                        {incidente.codigo_incidente}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getTipoIcon(incidente.tipo_incidente)}
                        <span className="text-sm">{incidente.tipo_incidente}</span>
                      </div>
                    </td>
                    <td>
                      <p className="font-medium">{incidente.titulo}</p>
                      {incidente.ip_origen && (
                        <p className="text-xs text-gray-500">IP: {incidente.ip_origen}</p>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getSeveridadColor(incidente.severidad)}`}>
                        {incidente.severidad}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          incidente.estado === 'Resuelto'
                            ? 'badge-success'
                            : incidente.estado === 'En Investigación'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {incidente.estado}
                      </span>
                    </td>
                    <td className="text-sm">{formatFecha(incidente.fecha_deteccion)}</td>
                    <td>{incidente.asignado_nombre || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nuevo Incidente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Incidente</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Incidente
                  </label>
                  <input
                    type="text"
                    name="codigo_incidente"
                    required
                    value={formData.codigo_incidente}
                    onChange={handleInputChange}
                    placeholder="Ej: INC-2024-001"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Incidente
                  </label>
                  <select
                    name="tipo_incidente"
                    required
                    value={formData.tipo_incidente}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="Malware">Malware</option>
                    <option value="Phishing">Phishing</option>
                    <option value="DDoS">DDoS</option>
                    <option value="Intrusión">Intrusión</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severidad
                  </label>
                  <select
                    name="severidad"
                    required
                    value={formData.severidad}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origen / Fuente
                  </label>
                  <input
                    type="text"
                    name="origen"
                    value={formData.origen}
                    onChange={handleInputChange}
                    placeholder="Ej: Firewall, Antivirus"
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    required
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Resumen breve del incidente"
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción Detallada
                  </label>
                  <textarea
                    name="descripcion"
                    required
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Detalles completos del incidente..."
                    className="input"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP de Origen (Opcional)
                  </label>
                  <input
                    type="text"
                    name="ip_origen"
                    value={formData.ip_origen}
                    onChange={handleInputChange}
                    placeholder="Ej: 192.168.1.100"
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar Incidente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

