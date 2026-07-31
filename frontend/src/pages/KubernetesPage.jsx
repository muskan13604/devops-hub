import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kubernetesApi } from '../services/kubernetes.api';
import { FiBox, FiLayers, FiActivity, FiServer, FiTrash2, FiRotateCw, FiPlus, FiAlertCircle } from 'react-icons/fi';

export function KubernetesPage() {
  const [namespace, setNamespace] = useState('default');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  const { data: podsRes, isLoading: podsLoading, error: podsError } = useQuery({
    queryKey: ['k8sPods', namespace],
    queryFn: () => kubernetesApi.getPods(namespace),
    retry: false
  });

  const { data: depsRes, isLoading: depsLoading } = useQuery({
    queryKey: ['k8sDeployments', namespace],
    queryFn: () => kubernetesApi.getDeployments(namespace),
    retry: false
  });

  const { data: svcRes, isLoading: svcLoading } = useQuery({
    queryKey: ['k8sServices', namespace],
    queryFn: () => kubernetesApi.getServices(namespace),
    retry: false
  });

  const { data: nsRes } = useQuery({
    queryKey: ['k8sNamespaces'],
    queryFn: kubernetesApi.getNamespaces,
    retry: false
  });

  const pods = podsRes?.data || [];
  const deployments = depsRes?.data || [];
  const services = svcRes?.data || [];
  const namespaces = nsRes?.data || [{ name: 'default' }];

  if (podsError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-rose-100 shadow-sm text-center">
        <FiAlertCircle className="text-rose-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Kubernetes Connection Failed</h2>
        <p className="text-slate-500 max-w-md">
          Could not connect to the Kubernetes cluster. Please ensure your backend container has a valid `~/.kube/config` or is running inside a cluster with appropriate RBAC roles.
        </p>
        <p className="text-xs text-slate-400 mt-4 font-mono">{podsError.message}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kubernetes Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Manage deployments, pods, and services in your cluster.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={namespace} 
            onChange={(e) => setNamespace(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 bg-white text-slate-700 shadow-sm"
          >
            {namespaces.map(ns => (
              <option key={ns.name} value={ns.name}>Namespace: {ns.name}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsDeployModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700"
          >
            <FiPlus /> Deploy App
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Pods" value={pods.length} icon={<FiBox />} color="sky" />
        <StatCard title="Deployments" value={deployments.length} icon={<FiLayers />} color="indigo" />
        <StatCard title="Services" value={services.length} icon={<FiServer />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Deployments Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FiLayers /> Deployments</h3>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Replicas</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {depsLoading ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-sm text-slate-500">Loading...</td></tr>
                ) : deployments.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-sm text-slate-500">No deployments found</td></tr>
                ) : (
                  deployments.map(dep => <DeploymentRow key={dep.name} dep={dep} namespace={namespace} />)
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pods Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FiBox /> Pods</h3>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Restarts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {podsLoading ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-sm text-slate-500">Loading...</td></tr>
                ) : pods.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center text-sm text-slate-500">No pods found</td></tr>
                ) : (
                  pods.map(pod => (
                    <tr key={pod.name} className="hover:bg-slate-50">
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{pod.name}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          pod.status === 'Running' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {pod.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">{pod.restarts}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isDeployModalOpen && <DeployModal namespace={namespace} onClose={() => setIsDeployModalOpen(false)} />}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    sky: 'bg-sky-50 text-sky-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
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

function DeploymentRow({ dep, namespace }) {
  const queryClient = useQueryClient();
  const scaleMutation = useMutation({
    mutationFn: (reps) => kubernetesApi.scaleDeployment(namespace, dep.name, reps),
    onSuccess: () => queryClient.invalidateQueries(['k8sDeployments', namespace])
  });
  const restartMutation = useMutation({
    mutationFn: () => kubernetesApi.restartDeployment(namespace, dep.name),
    onSuccess: () => queryClient.invalidateQueries(['k8sPods', namespace])
  });
  const deleteMutation = useMutation({
    mutationFn: () => kubernetesApi.deleteDeployment(namespace, dep.name),
    onSuccess: () => queryClient.invalidateQueries(['k8sDeployments', namespace])
  });

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{dep.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center gap-2">
        <span className="bg-slate-100 px-2 py-1 rounded-md">{dep.availableReplicas} / {dep.replicas}</span>
        <button onClick={() => scaleMutation.mutate(dep.replicas + 1)} className="text-slate-400 hover:text-indigo-600">+</button>
        <button onClick={() => scaleMutation.mutate(Math.max(0, dep.replicas - 1))} className="text-slate-400 hover:text-indigo-600">-</button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => restartMutation.mutate()} disabled={restartMutation.isPending} className="text-slate-400 hover:text-emerald-600 p-2 rounded-lg transition-colors mr-2" title="Restart">
          <FiRotateCw size={16} className={restartMutation.isPending ? "animate-spin" : ""} />
        </button>
        <button onClick={() => { if(window.confirm('Delete deployment?')) deleteMutation.mutate(); }} disabled={deleteMutation.isPending} className="text-slate-400 hover:text-rose-600 p-2 rounded-lg transition-colors" title="Delete">
          <FiTrash2 size={16} />
        </button>
      </td>
    </tr>
  );
}

function DeployModal({ namespace, onClose }) {
  const [form, setForm] = useState({ name: '', image: '', port: 80, replicas: 1 });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => kubernetesApi.deployApp({ ...form, namespace }),
    onSuccess: () => {
      queryClient.invalidateQueries(['k8sDeployments', namespace]);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FiPlus /> Deploy Application</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">App Name</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="my-nginx-app" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Container Image</label>
            <input required type="text" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="nginx:latest" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Container Port</label>
              <input required type="number" value={form.port} onChange={(e) => setForm({...form, port: parseInt(e.target.value)})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Replicas</label>
              <input required type="number" min="1" value={form.replicas} onChange={(e) => setForm({...form, replicas: parseInt(e.target.value)})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
              {mutation.isPending ? 'Deploying...' : 'Deploy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
