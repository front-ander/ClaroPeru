import { useEffect, useState } from 'react';
import { redesAPI } from '../../../services/api';
import { Plus, Edit, Trash2, Search, X, Wifi, MapPin } from 'lucide-react';

export const Nodos = () => {
  const [nodos, setNodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tipo: 'FTTH',
    ubicacion_lat: '',
    ubicacion_lng: '',
    direccion: '',
    distrito: '',
    provincia: '',
    capacidad_maxima: '',
    estado: 'En Construcción',
    fecha_instalacion: '',
  });

  useEffect(() => {
    loadNodos();
  }, []);

  const loadNodos = async () => {
    try {
      const response = await redesAPI.getAllNodos();
      setNodos(response.data.data);
    } catch (error) {
      console.error('Error al cargar nodos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        capacidad_maxima: formData.capacidad_maxima ? parseInt(formData.capacidad_maxima) : null,
        ubicacion_lat: formData.ubicacion_lat ? parseFloat(formData.ubicacion_lat) : null,
        ubicacion_lng: formData.ubicacion_lng ? parseFloat(formData.ubicacion_lng) : null,
      };

      if (editingId) {
        await redesAPI.updateNodo(editingId, dataToSend);
      } else {
        await redesAPI.createNodo(dataToSend);
      }
      await loadNodos();
      handleCloseModal();
      alert(editingId ? 'Nodo actualizado correctamente' : 'Nodo creado correctamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar nodo');
    }
  };

  const handleEdit = (nodo) => {
    setEditingId(nodo.id);
    setFormData({
      codigo: nodo.codigo,
      nombre: nodo.nombre,
      tipo: nodo.tipo,
      ubicacion_lat: nodo.ubicacion_lat || '',
      ubicacion_lng: nodo.ubicacion_lng || '',
      direccion: nodo.direccion || '',
      distrito: nodo.distrito || '',
      provincia: nodo.provincia || '',
      capacidad_maxima: nodo.capacidad_maxima || '',
      estado: nodo.estado,
      fecha_instalacion: nodo.fecha_instalacion || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      codigo: '',
      nombre: '',
      tipo: 'FTTH',
      ubicacion_lat: '',
      ubicacion_lng: '',
      direccion: '',
      distrito: '',
      provincia: '',
      capacidad_maxima: '',
      estado: 'En Construcción',
      fecha_instalacion: '',
    });
  };

  const filteredNodos = nodos.filter((n) => {
    const matchSearch =
      n.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = !filtroTipo || n.tipo === filtroTipo;
    const matchEstado = !filtroEstado || n.estado === filtroEstado;
    return matchSearch && matchTipo && matchEstado;
  });

  const getTipoColor = (tipo) => {
    const colors = {
      FTTH: 'badge-info',
      '5G': 'badge-success',
      '4G': 'badge-warning',
      Satelital: 'badge-danger',
      Híbrido: 'badge-secondary',
    };
    return colors[tipo] || 'badge-info';
  };

  const getEstadoColor = (estado) => {
    const colors = {
      Operativo: 'badge-success',
      Mantenimiento: 'badge-warning',
      'Fuera de Servicio': 'badge-danger',
      'En Construcción': 'badge-info',
    };
    return colors[estado] || 'badge-info';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Nodos de Red</h1>
        <p className="text-gray-600 mt-2">Administra la infraestructura de red FTTH, 5G y 4G</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="input"
          >
            <option value="">Todos los tipos</option>
            <option value="FTTH">FTTH</option>
            <option value="5G">5G</option>
            <option value="4G">4G</option>
            <option value="Satelital">Satelital</option>
            <option value="Híbrido">Híbrido</option>
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="input"
          >
            <option value="">Todos los estados</option>
            <option value="Operativo">Operativo</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Fuera de Servicio">Fuera de Servicio</option>
            <option value="En Construcción">En Construcción</option>
          </select>
          <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Nodo
          </button>
        </div>
      </div>

      {/* Tabla de nodos */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredNodos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Wifi className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No se encontraron nodos</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary mt-4 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Crear Primer Nodo
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Ubicación</th>
                  <th>Capacidad</th>
                  <th>Uso</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredNodos.map((nodo) => (
                  <tr key={nodo.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold">{nodo.codigo}</span>
                    </td>
                    <td className="font-medium">{nodo.nombre}</td>
                    <td>
                      <span className={`badge ${getTipoColor(nodo.tipo)}`}>{nodo.tipo}</span>
                    </td>
                    <td>
                      {nodo.distrito && nodo.provincia ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{nodo.distrito}, {nodo.provincia}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      {nodo.capacidad_maxima ? (
                        <span>{nodo.capacidad_maxima}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      {nodo.porcentaje_uso !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                parseFloat(nodo.porcentaje_uso) > 80
                                  ? 'bg-red-600'
                                  : parseFloat(nodo.porcentaje_uso) > 60
                                  ? 'bg-yellow-600'
                                  : 'bg-green-600'
                              }`}
                              style={{ width: `${nodo.porcentaje_uso}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{nodo.porcentaje_uso}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getEstadoColor(nodo.estado)}`}>{nodo.estado}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(nodo)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={handleCloseModal} />
            <div className="relative bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Editar Nodo' : 'Nuevo Nodo'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="input"
                      placeholder="Ej: NODO-FTTH-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="FTTH">FTTH</option>
                      <option value="5G">5G</option>
                      <option value="4G">4G</option>
                      <option value="Satelital">Satelital</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      className="input"
                    >
                      <option value="En Construcción">En Construcción</option>
                      <option value="Operativo">Operativo</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Fuera de Servicio">Fuera de Servicio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidad Máxima
                    </label>
                    <input
                      type="number"
                      value={formData.capacidad_maxima}
                      onChange={(e) => setFormData({ ...formData, capacidad_maxima: e.target.value })}
                      className="input"
                      placeholder="Ej: 1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Instalación
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_instalacion}
                      onChange={(e) => setFormData({ ...formData, fecha_instalacion: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distrito</label>
                    <input
                      type="text"
                      value={formData.distrito}
                      onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                    <input
                      type="text"
                      value={formData.provincia}
                      onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitud (GPS)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.ubicacion_lat}
                      onChange={(e) => setFormData({ ...formData, ubicacion_lat: e.target.value })}
                      className="input"
                      placeholder="Ej: -12.0464"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitud (GPS)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.ubicacion_lng}
                      onChange={(e) => setFormData({ ...formData, ubicacion_lng: e.target.value })}
                      className="input"
                      placeholder="Ej: -77.0428"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Actualizar' : 'Crear'}
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

