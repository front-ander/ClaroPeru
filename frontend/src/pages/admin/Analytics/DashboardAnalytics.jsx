import { useEffect, useState } from 'react';
import { analyticsAPI } from '../../../services/api';
import { BarChart3, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';

export const DashboardAnalytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [tendencias, setTendencias] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardRes, tendenciasRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getTendenciasVentas({ meses: 6 }),
      ]);
      setDashboard(dashboardRes.data.data);
      setTendencias(tendenciasRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoneda = (monto) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
    }).format(monto);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Business Intelligence</h1>
        <p className="text-gray-600 mt-2">Análisis de datos y predicciones con IA</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard.clientes.total}</p>
              <p className="text-xs text-green-600 mt-1">
                {dashboard.clientes.activos} activos
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboard.contratos.activos}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboard.contratos.total} totales
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Facturado</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatMoneda(dashboard.facturacion.total)}
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
              <p className="text-sm font-medium text-gray-600">Tickets Abiertos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboard.soporte.tickets_abiertos}
              </p>
              {dashboard.soporte.satisfaccion_promedio && (
                <p className="text-xs text-gray-500 mt-1">
                  ⭐ {dashboard.soporte.satisfaccion_promedio}/5
                </p>
              )}
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <AlertCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Clientes por segmento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Clientes por Segmento</h2>
          <div className="space-y-3">
            {dashboard.clientes.por_segmento.map((item) => (
              <div key={item.tipo}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.tipo}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.cantidad}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(item.cantidad / dashboard.clientes.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tendencias de facturación */}
        {tendencias && tendencias.tendencias_facturacion.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tendencias de Facturación</h2>
            <div className="space-y-3">
              {tendencias.tendencias_facturacion.slice(0, 6).map((item) => (
                <div key={item.mes}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.mes}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatMoneda(item.total_facturado)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (item.total_facturado /
                            Math.max(...tendencias.tendencias_facturacion.map((t) => t.total_facturado))) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Servicios más populares */}
      {tendencias && tendencias.servicios_populares.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Servicios Más Contratados</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Categoría</th>
                  <th>Contratos</th>
                </tr>
              </thead>
              <tbody>
                {tendencias.servicios_populares.map((servicio) => (
                  <tr key={servicio.nombre}>
                    <td className="font-medium">{servicio.nombre}</td>
                    <td>
                      <span className="badge badge-info">{servicio.categoria}</span>
                    </td>
                    <td className="font-semibold">{servicio.cantidad_contratos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

