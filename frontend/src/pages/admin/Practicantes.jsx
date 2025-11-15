import { useEffect, useState } from 'react';
import { practicanteAPI } from '../../services/api';
import { Plus, Edit, Trash2, Search, X, Eye } from 'lucide-react';

export const Practicantes = () => {
  const [practicantes, setPracticantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    documento: '',
    telefono: '',
    codigo: '',
    email: '',
    periodo: '',
    turno: '',    // Agregar campo
    horario: '',  // Agregar campo
  });

  useEffect(() => {
    loadPracticantes();
  }, []);

  const loadPracticantes = async () => {
    try {
      const response = await practicanteAPI.getAll();
      setPracticantes(response.data.data);
    } catch (error) {
      console.error('Error al cargar practicantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await practicanteAPI.update(editingId, formData);
      } else {
        await practicanteAPI.create(formData);
      }

      await loadPracticantes();
      handleCloseModal();
      alert(editingId ? 'Practicante actualizado correctamente' : 'Practicante creado correctamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar practicante');
    }
  };

  const handleEdit = (practicante) => {
    setEditingId(practicante.id);
    setFormData({
      nombre: practicante.nombre,
      apellidos: practicante.apellidos,
      documento: practicante.documento,
      telefono: practicante.telefono || '',
      codigo: practicante.codigo,
      email: practicante.email || '',
      periodo: practicante.periodo || '',
      turno: practicante.turno || '',     // Agregar campo
      horario: practicante.horario || '', // Agregar campo
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este practicante?')) return;

    try {
      await practicanteAPI.delete(id);
      await loadPracticantes();
    } catch (error) {
      alert('Error al eliminar practicante');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      apellidos: '',
      documento: '',
      telefono: '',
      codigo: '',
      email: '',
      periodo: '',
      turno: '',    // Agregar campo
      horario: '',  // Agregar campo
    });
  };

  const filteredPracticantes = practicantes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.documento.includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Trabajadores</h1>
        <p className="text-gray-600 mt-2">Administra los trabajadores del sistema</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, código o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Practicante
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPracticantes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No se encontraron trabajadores</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre Completo</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Periodo</th>
                  <th>Horario</th>
                  <th>Turno</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPracticantes.map((practicante) => (
                  <tr key={practicante.id}>
                    <td>
                      <span className="badge badge-info font-mono">{practicante.codigo}</span>
                    </td>
                    <td className="font-medium">
                      {practicante.nombre} {practicante.apellidos}
                    </td>
                    <td>{practicante.documento}</td>
                    <td>{practicante.telefono || '-'}</td>
                    <td>{practicante.periodo}</td>
                    <td>{practicante.horario}</td>
                    <td>{practicante.turno}</td>
                    <td className="text-sm">{practicante.email || '-'}</td>
                    <td>
                      <span
                        className={`badge ${
                          practicante.activo ? 'badge-success' : 'badge-danger'
                        }`}
                      >
                        {practicante.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(practicante)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(practicante.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Editar Practicante' : 'Nuevo Practicante'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documento (DNI) *
                    </label>
                    <input
                      type="text"
                      value={formData.documento}
                      onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                      className="input"
                      maxLength="8"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="input"
                      placeholder="Ej: PRACT-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="input"
                      maxLength="9"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Periodo
                    </label>
                    <input
                      type="text"
                      value={formData.periodo}
                      onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Turno
                    </label>
                    <input
                      type="text"
                      value={formData.turno}
                      onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horario
                    </label>
                    <input
                      type="text"
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                {!editingId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> El usuario será el mismo que el código. La contraseña
                      por defecto será <strong>123456</strong>
                    </p>
                  </div>
                )}

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
