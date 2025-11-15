import { useEffect, useState } from 'react';
import { reporteAPI } from '../../services/api';
import { Clock, LogOut, FileText, Calendar } from 'lucide-react';

export const Reportes = () => {
  const [tardanzas, setTardanzas] = useState({ tardanzas: [], resumen: [] });
  const [salidasTempranas, setSalidasTempranas] = useState({ salidas_tempranas: [], resumen: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tardanzas');

  useEffect(() => {
    loadReportes();
  }, []);

  const loadReportes = async () => {
    try {
      const [resTardanzas, resSalidas] = await Promise.all([
        reporteAPI.getTardanzas(),
        reporteAPI.getSalidasTempranas(),
      ]);

      setTardanzas(resTardanzas.data.data);
      setSalidasTempranas(resSalidas.data.data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatHora = (hora) => {
    return hora.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-2">Estadísticas y reportes detallados del sistema</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('tardanzas')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tardanzas'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Tardanzas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('salidas')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'salidas'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Salidas Tempranas
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido de Tardanzas */}
      {activeTab === 'tardanzas' && (
        <div className="space-y-6">
          {/* Resumen */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumen de Tardanzas por Trabajador
            </h2>
            {tardanzas.resumen.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay tardanzas registradas</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tardanzas.resumen.map((item) => (
                  <div key={item.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.nombre_completo}</p>
                        <p className="text-sm text-gray-600 mt-1">Código: {item.codigo}</p>
                      </div>
                      <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-xl font-bold text-yellow-700">
                          {item.total_tardanzas}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalle */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Detalle de Tardanzas ({tardanzas.tardanzas.length})
            </h2>
            {tardanzas.tardanzas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay tardanzas registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Trabajador</th>
                      <th>Código</th>
                      <th>Documento</th>
                      <th>Hora de Entrada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tardanzas.tardanzas.map((item) => (
                      <tr key={item.id}>
                        <td>{formatFecha(item.fecha)}</td>
                        <td className="font-medium">{item.practicante_nombre}</td>
                        <td>
                          <span className="badge badge-info">{item.codigo}</span>
                        </td>
                        <td>{item.documento}</td>
                        <td>
                          <span className="badge badge-warning font-mono">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatHora(item.hora)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenido de Salidas Tempranas */}
      {activeTab === 'salidas' && (
        <div className="space-y-6">
          {/* Resumen */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumen de Salidas Tempranas por Trabajador
            </h2>
            {salidasTempranas.resumen.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay salidas tempranas registradas
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salidasTempranas.resumen.map((item) => (
                  <div key={item.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.nombre_completo}</p>
                        <p className="text-sm text-gray-600 mt-1">Código: {item.codigo}</p>
                      </div>
                      <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-xl font-bold text-orange-700">
                          {item.total_salidas_tempranas}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalle */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Detalle de Salidas Tempranas ({salidasTempranas.salidas_tempranas.length})
            </h2>
            {salidasTempranas.salidas_tempranas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay salidas tempranas registradas
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Trabajador</th>
                      <th>Código</th>
                      <th>Documento</th>
                      <th>Hora de Salida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salidasTempranas.salidas_tempranas.map((item) => (
                      <tr key={item.id}>
                        <td>{formatFecha(item.fecha)}</td>
                        <td className="font-medium">{item.practicante_nombre}</td>
                        <td>
                          <span className="badge badge-info">{item.codigo}</span>
                        </td>
                        <td>{item.documento}</td>
                        <td>
                          <span className="badge badge-warning font-mono">
                            <LogOut className="w-3 h-3 mr-1" />
                            {formatHora(item.hora)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
