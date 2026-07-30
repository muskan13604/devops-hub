import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jenkinsApi } from '../services/jenkins.api';
import { FiCloudLightning, FiSettings, FiPlay, FiClock, FiCheckCircle, FiXCircle, FiLoader, FiFileText, FiX } from 'react-icons/fi';

export function DeploymentsPage() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [viewingLogs, setViewingLogs] = useState(null);
  const queryClient = useQueryClient();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['jenkinsHistory'],
    queryFn: jenkinsApi.getHistory,
    retry: false
  });

  const history = response?.data || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Deployments</h1>
          <p className="mt-2 text-sm text-slate-500">Manage CI/CD pipelines via Jenkins integration.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsConfigModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <FiSettings /> Setup Jenkins
          </button>
          <button 
            onClick={() => setIsTriggerModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700"
          >
            <FiPlay /> Trigger Build
          </button>
        </div>
      </div>

      {error?.response?.data?.code === 'JENKINS_NOT_CONNECTED' ? (
        <div className="max-w-md mx-auto mt-12 rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-200 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-600 mb-6">
            <FiCloudLightning size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Connect Jenkins</h3>
          <p className="text-sm text-slate-500 mb-6">You need to connect your Jenkins account before viewing build history.</p>
          <button 
            onClick={() => setIsConfigModalOpen(true)}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-md"
          >
            Configure Credentials
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FiClock /> Build History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Parameters</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Triggered At</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Loading history...</td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                      No builds found. Trigger one to get started!
                    </td>
                  </tr>
                ) : (
                  history.map((build, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                        {build.jobName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          build.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' :
                          build.status === 'FAILURE' ? 'bg-rose-50 text-rose-700' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {build.status === 'SUCCESS' && <FiCheckCircle size={12} />}
                          {build.status === 'FAILURE' && <FiXCircle size={12} />}
                          {build.status === 'TRIGGERED' && <FiLoader className="animate-spin" size={12} />}
                          {build.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {Object.keys(build.parameters || {}).length > 0 ? (
                          <pre className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 max-w-xs overflow-x-auto">
                            {JSON.stringify(build.parameters, null, 2)}
                          </pre>
                        ) : 'None'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(build.triggeredAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* We use historyId (from MongoDB) to identify builds in Jenkins if we had real mapping, 
                            but in this demo, Jenkins assigns its own ID. We assume a 1-to-1 or prompt the user for the Build ID for logs.
                            For now, let's just use a placeholder to show logs if they know the Jenkins build ID. */}
                        <button onClick={() => setViewingLogs(build)} className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg transition-colors">
                          <FiFileText size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isConfigModalOpen && <ConfigModal onClose={() => setIsConfigModalOpen(false)} />}
      {isTriggerModalOpen && <TriggerModal onClose={() => setIsTriggerModalOpen(false)} />}
      {viewingLogs && <LogsViewerModal build={viewingLogs} onClose={() => setViewingLogs(null)} />}
    </div>
  );
}

function ConfigModal({ onClose }) {
  const [form, setForm] = useState({ url: '', username: '', token: '' });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: jenkinsApi.saveConfig,
    onSuccess: () => {
      queryClient.invalidateQueries(['jenkinsHistory']);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FiSettings /> Configure Jenkins</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jenkins URL</label>
            <input required type="url" placeholder="http://jenkins.example.com" value={form.url} onChange={(e) => setForm({...form, url: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input required type="text" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Token</label>
            <input required type="password" value={form.token} onChange={(e) => setForm({...form, token: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
              {mutation.isPending ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TriggerModal({ onClose }) {
  const [jobName, setJobName] = useState('');
  const [paramKey, setParamKey] = useState('');
  const [paramValue, setParamValue] = useState('');
  const [parameters, setParameters] = useState({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => jenkinsApi.triggerBuild(jobName, parameters),
    onSuccess: () => {
      queryClient.invalidateQueries(['jenkinsHistory']);
      onClose();
    }
  });

  const addParam = () => {
    if (paramKey && paramValue) {
      setParameters({ ...parameters, [paramKey]: paramValue });
      setParamKey('');
      setParamValue('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FiPlay /> Trigger Build</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Name</label>
            <input required type="text" value={jobName} onChange={(e) => setJobName(e.target.value)} placeholder="my-pipeline" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Add Parameter (Optional)</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Key" value={paramKey} onChange={(e) => setParamKey(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              <input type="text" placeholder="Value" value={paramValue} onChange={(e) => setParamValue(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              <button type="button" onClick={addParam} className="bg-slate-100 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200">Add</button>
            </div>
          </div>
          
          {Object.keys(parameters).length > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Parameters</h4>
              {Object.entries(parameters).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1">
                  <span className="font-mono text-indigo-600">{k}</span>
                  <span className="text-slate-600">{v}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
              {mutation.isPending ? 'Triggering...' : 'Start Build'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LogsViewerModal({ build, onClose }) {
  const [buildId, setBuildId] = useState('lastBuild'); // Usually Jenkins exposes 'lastBuild'
  const { data, isLoading, error } = useQuery({
    queryKey: ['jenkinsLogs', build.jobName, buildId],
    queryFn: () => jenkinsApi.getBuildLogs(build.jobName, buildId),
    retry: false
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 p-0 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col border border-slate-700">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono">
            <FiFileText /> Logs: {build.jobName} 
            <input type="text" value={buildId} onChange={e => setBuildId(e.target.value)} className="ml-2 bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded outline-none w-24 text-center text-slate-300" />
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <FiX size={20} />
          </button>
        </div>
        <div className="p-6 bg-black overflow-y-auto max-h-[70vh] min-h-[300px]">
          {isLoading ? (
            <div className="text-slate-500 text-sm font-mono flex items-center gap-2"><FiLoader className="animate-spin" /> Fetching console output from Jenkins...</div>
          ) : error ? (
            <div className="text-rose-400 text-sm font-mono">Error: {error.response?.data?.message || error.message}</div>
          ) : (
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{data?.data?.logs}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
