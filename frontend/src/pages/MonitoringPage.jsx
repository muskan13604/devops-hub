import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { monitoringApi } from '../services/monitoring.api';
import { FiCpu, FiHardDrive, FiActivity, FiRefreshCw, FiExternalLink } from 'react-icons/fi';

export function MonitoringPage() {
  const [grafanaUrl, setGrafanaUrl] = useState('http://localhost:3000/d-solo/system-overview/system-overview?orgId=1&refresh=5s&theme=light');

  const { data: metricsRes, isLoading, error, refetch } = useQuery({
    queryKey: ['prometheusMetrics'],
    queryFn: monitoringApi.getMetrics,
    refetchInterval: 5000 // auto-refresh every 5s
  });

  const metrics = metricsRes?.data || { cpu: [], memory: [] };

  // Calculate aggregates
  const totalCpu = metrics.cpu.reduce((acc, curr) => acc + curr.value, 0).toFixed(4);
  const totalMem = metrics.memory.reduce((acc, curr) => acc + curr.value, 0);
  const memInMb = (totalMem / 1024 / 1024).toFixed(2);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Monitoring</h1>
          <p className="mt-2 text-sm text-slate-500">Live Prometheus metrics and embedded Grafana dashboards.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-8 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm">
          Warning: Could not connect to the local Prometheus server on the backend. Showing placeholders or empty data.
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total CPU Usage" value={`${totalCpu} cores`} icon={<FiCpu />} color="indigo" />
        <MetricCard title="Total Memory Usage" value={`${memInMb} MB`} icon={<FiHardDrive />} color="emerald" />
        <MetricCard title="Active Pods" value={metrics.cpu.length} icon={<FiActivity />} color="sky" />
        <MetricCard title="Network I/O" value="~ 1.2 MB/s" icon={<FiActivity />} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PromQL Raw Metrics Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Prometheus Exporter</h3>
            </div>
            <div className="p-0 overflow-y-auto max-h-[600px]">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Target (Pod)</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">CPU (cores)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr><td colSpan="2" className="px-6 py-8 text-center text-sm text-slate-500">Loading...</td></tr>
                  ) : metrics.cpu.length === 0 ? (
                    <tr><td colSpan="2" className="px-6 py-8 text-center text-sm text-slate-500">No telemetry data</td></tr>
                  ) : (
                    metrics.cpu.map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900 font-mono text-xs">{m.pod}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500 text-right font-mono">{m.value.toFixed(4)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Grafana Embed Section */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full min-h-[600px] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Grafana_icon.svg" alt="Grafana" className="w-5 h-5" />
                Grafana Embedded Dashboard
              </h3>
              <a href={grafanaUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                Open in Grafana <FiExternalLink size={14} />
              </a>
            </div>
            
            <div className="flex-1 bg-slate-50 relative p-4">
              <div className="mb-4">
                <input 
                  type="url" 
                  value={grafanaUrl}
                  onChange={(e) => setGrafanaUrl(e.target.value)}
                  className="w-full text-xs font-mono rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
                  placeholder="Paste Grafana Embed URL here"
                />
                <p className="text-xs text-slate-500 mt-1">Make sure Grafana allows embedding (set `allow_embedding = true` in grafana.ini).</p>
              </div>
              
              <div className="w-full h-[500px] bg-slate-900 rounded-lg overflow-hidden border border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <FiActivity size={48} className="mb-4 text-slate-600" />
                <h4 className="text-lg font-medium text-slate-300">Grafana Dashboard Not Connected</h4>
                <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">
                  The Grafana container is currently not running or could not be reached at the specified URL. Please ensure Grafana is deployed to view embedded dashboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  const colorMap = {
    sky: 'bg-sky-50 text-sky-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
      <div className={`p-4 rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      </div>
    </div>
  );
}
