import { useEffect, useState } from 'react';
import { crmAPI } from '../../../services/api';
import { Plus, Edit, Trash2, Search, X, Users, Building2, Briefcase } from 'lucide-react';

export const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [segmentos, setSegmentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSegmento, setFiltroSegmento] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    segmento_id: '',
    tipo_documento: 'DNI',
    numero_documento: '',
    razon_social: '',
    nombre_comercial: '',
    email: '',
    telefono: '',
    direccion: '',
    distrito: '',
    provincia: '',
    departamento: '',
    estado: 'Prospecto',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientesRes, segmentosRes] = await Promise.all([
        crmAPI.getAllClientes(),
        crmAPI.getSegmentos(),
      ]);
      setClientes(clientesRes.data.data);
      setSegmentos(segmentosRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await crmAPI.updateCliente(editingId, formData);
      } else {
        await crmAPI.createCliente(formData);
      }
      await loadData();
      handleCloseModal();
      alert(editingId ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar cliente');
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    setFormData({
      segmento_id: cliente.segmento_id,
      tipo_documento: cliente.tipo_documento,
      numero_documento: cliente.numero_documento,
      razon_social: cliente.razon_social,
      nombre_comercial: cliente.nombre_comercial || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      distrito: cliente.distrito || '',
      provincia: cliente.provincia || '',
      departamento: cliente.departamento || '',
      estado: cliente.estado,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      segmento_id: '',
      tipo_documento: 'DNI',
      numero_documento: '',
      razon_social: '',
      nombre_comercial: '',
      email: '',
      telefono: '',
      direccion: '',
      distrito: '',
      provincia: '',
      departamento: '',
      estado: 'Prospecto',
    });
  };

  const filteredClientes = clientes.filter((c) => {
    const matchSearch =
      c.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.numero_documento.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSegmento = !filtroSegmento || c.segmento_id == filtroSegmento;
    const matchEstado = !filtroEstado || c.estado === filtroEstado;
    return matchSearch && matchSegmento && matchEstado;
  });

  const getSegmentoIcon = (tipo) => {
    switch (tipo) {
      case 'Personas':
        return <Users className="w-4 h-4" />;
      case 'Empresas':
        return <Building2 className="w-4 h-4" />;
      case 'Pymes':
        return <Briefcase className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-600 mt-2">Administra la base de datos de clientes de Claro</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, documento o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filtroSegmento}
            onChange={(e) => setFiltroSegmento(e.target.value)}
            className="input"
          >
            <option value="">Todos los segmentos</option>
            {segmentos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="input"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Prospecto">Prospecto</option>
            <option value="Suspendido">Suspendido</option>
          </select>
          <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No se encontraron clientes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Cliente</th>
                  <th>Segmento</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <span className="font-mono text-sm">{cliente.numero_documento}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{cliente.razon_social}</p>
                        {cliente.nombre_comercial && (
                          <p className="text-xs text-gray-500">{cliente.nombre_comercial}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getSegmentoIcon(cliente.segmento_tipo)}
                        <span className="text-sm">{cliente.segmento_nombre}</span>
                      </div>
                    </td>
                    <td className="text-sm">{cliente.email || '-'}</td>
                    <td>{cliente.telefono || '-'}</td>
                    <td>
                      <span
                        className={`badge ${
                          cliente.estado === 'Activo'
                            ? 'badge-success'
                            : cliente.estado === 'Prospecto'
                            ? 'badge-info'
                            : 'badge-danger'
                        }`}
                      >
                        {cliente.estado}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
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
                  {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Segmento *
                    </label>
                    <select
                      value={formData.segmento_id}
                      onChange={(e) => setFormData({ ...formData, segmento_id: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {segmentos.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo Documento *
                    </label>
                    <select
                      value={formData.tipo_documento}
                      onChange={(e) => setFormData({ ...formData, tipo_documento: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="DNI">DNI</option>
                      <option value="RUC">RUC</option>
                      <option value="CE">CE</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número Documento *
                    </label>
                    <input
                      type="text"
                      value={formData.numero_documento}
                      onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón Social *
                    </label>
                    <input
                      type="text"
                      value={formData.razon_social}
                      onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Comercial
                    </label>
                    <input
                      type="text"
                      value={formData.nombre_comercial}
                      onChange={(e) => setFormData({ ...formData, nombre_comercial: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="text"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      className="input"
                    >
                      <option value="Prospecto">Prospecto</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Suspendido">Suspendido</option>
                    </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                    <input
                      type="text"
                      value={formData.departamento}
                      onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                      className="input"
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

