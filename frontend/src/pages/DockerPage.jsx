import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dockerApi } from '../services/docker.api';
import { FiBox, FiDownload, FiTrash2, FiPlay, FiX, FiTerminal } from 'react-icons/fi';

export function DockerPage() {
  const [isPullModalOpen, setIsPullModalOpen] = useState(false);
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [logs, setLogs] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['dockerImages'],
    queryFn: dockerApi.listImages,
  });

  const deleteMutation = useMutation({
    mutationFn: dockerApi.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries(['dockerImages']);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteMutation.mutate(id);
    }
  };

  const images = response?.data || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Docker Images</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your local Docker container images.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPullModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <FiDownload /> Pull Image
          </button>
          <button 
            onClick={() => setIsBuildModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700"
          >
            <FiPlay /> Build Image
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Repository / Tag</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Image ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Loading images...</td>
                </tr>
              ) : images.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">
                    No images found. Pull or build one to get started!
                  </td>
                </tr>
              ) : (
                images.map((img, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                          <FiBox size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{img.Repository === '<none>' ? '<untagged>' : img.Repository}</div>
                          <div className="text-xs text-slate-500">{img.Tag === '<none>' ? '' : img.Tag}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                      {img.ID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {img.CreatedSince}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {img.Size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(img.ID)} disabled={deleteMutation.isPending} className="text-rose-600 hover:text-rose-900 p-2 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50">
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isPullModalOpen && (
        <PullModal onClose={() => setIsPullModalOpen(false)} onComplete={setLogs} />
      )}
      
      {isBuildModalOpen && (
        <BuildModal onClose={() => setIsBuildModalOpen(false)} onComplete={setLogs} />
      )}

      {logs && (
        <LogsModal logs={logs} onClose={() => setLogs(null)} />
      )}
    </div>
  );
}

function PullModal({ onClose, onComplete }) {
  const [imageName, setImageName] = useState('');
  const queryClient = useQueryClient();

  const pullMutation = useMutation({
    mutationFn: dockerApi.pullImage,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['dockerImages']);
      onClose();
      onComplete(res.data.logs);
    },
    onError: (err) => {
      onComplete(err.response?.data?.message || err.message);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FiDownload /> Pull Image</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); pullMutation.mutate(imageName); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image Name (e.g., nginx:latest)</label>
            <input required type="text" value={imageName} onChange={(e) => setImageName(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={pullMutation.isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
              {pullMutation.isPending ? 'Pulling...' : 'Pull Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BuildModal({ onClose, onComplete }) {
  const [form, setForm] = useState({ tag: '', path: '.' });
  const queryClient = useQueryClient();

  const buildMutation = useMutation({
    mutationFn: () => dockerApi.buildImage(form.tag, form.path),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['dockerImages']);
      onClose();
      onComplete(res.data.logs);
    },
    onError: (err) => {
      onComplete(err.response?.data?.message || err.message);
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FiPlay /> Build Image</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); buildMutation.mutate(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image Tag</label>
            <input required type="text" value={form.tag} onChange={(e) => setForm({...form, tag: e.target.value})} placeholder="my-app:v1" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Path Context</label>
            <input required type="text" value={form.path} onChange={(e) => setForm({...form, path: e.target.value})} placeholder="." className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            <p className="text-xs text-slate-500 mt-1">Directory containing the Dockerfile (relative to backend container).</p>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={buildMutation.isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
              {buildMutation.isPending ? 'Building (this may take a while)...' : 'Build Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LogsModal({ logs, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 p-0 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col border border-slate-700">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono"><FiTerminal /> Output Logs</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <FiX size={20} />
          </button>
        </div>
        <div className="p-6 bg-black overflow-y-auto max-h-[70vh]">
          <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap leading-relaxed">{logs}</pre>
        </div>
      </div>
    </div>
  );
}
