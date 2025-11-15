import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { redesAPI } from '../../../services/api';
import { Wifi, AlertTriangle, CheckCircle, XCircle, Activity, Plus, Settings } from 'lucide-react';

export const DashboardRedes = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await redesAPI.getDashboard();
      setDashboard(response.data.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Redes</h1>
          <p className="text-gray-600 mt-2">Monitoreo de infraestructura FTTH, 5G y 4G</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/redes/nodos')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Gestionar Nodos
          </button>
        </div>
      </div>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Nodos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard.total_nodos}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Wifi className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nodos Operativos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard.nodos_operativos}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alertas Críticas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard.alertas_criticas}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alertas Abiertas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard.alertas_abiertas}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Activity className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nodos por tipo */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nodos por Tipo</h2>
          {dashboard.nodos_por_tipo && dashboard.nodos_por_tipo.length > 0 ? (
            <div className="space-y-3">
              {dashboard.nodos_por_tipo.map((item) => (
                <div key={item.tipo}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.tipo}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.cantidad}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${dashboard.total_nodos > 0 ? (item.cantidad / dashboard.total_nodos) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Wifi className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No hay nodos registrados</p>
              <p className="text-sm mt-1">Agrega nodos para ver las estadísticas</p>
            </div>
          )}
        </div>

        {/* Alertas por severidad */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alertas por Severidad</h2>
          {dashboard.alertas_por_severidad && dashboard.alertas_por_severidad.length > 0 ? (
            <div className="space-y-3">
              {dashboard.alertas_por_severidad.map((item) => {
                const colors = {
                  Crítico: 'bg-red-600',
                  Error: 'bg-orange-600',
                  Advertencia: 'bg-yellow-600',
                  Info: 'bg-blue-600',
                };
                return (
                  <div key={item.severidad}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.severidad}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.cantidad}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors[item.severidad] || 'bg-gray-600'} h-2 rounded-full`}
                        style={{
                          width: `${dashboard.alertas_abiertas > 0 ? (item.cantidad / dashboard.alertas_abiertas) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No hay alertas activas</p>
              <p className="text-sm mt-1">Todo está funcionando correctamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

