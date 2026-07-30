import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../services/projects.api';
import { githubApi } from '../services/github.api';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiGithub, FiActivity, FiServer, FiX, FiGitBranch, FiGitCommit, FiExternalLink, FiClock } from 'react-icons/fi';

export function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null); // For slide-over
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['projects', { page, search }],
    queryFn: () => projectsApi.list({ page, limit: 10, search }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (viewingProject) setViewingProject(null);
    }
  });

  const handleEdit = (project, e) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  const projects = data?.data || [];
  const meta = data?.meta || { totalPages: 1 };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex">
      <div className="flex-1">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your connected repositories and delivery pipelines.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="h-10 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-64"
              />
            </div>
            <button 
              onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700"
            >
              <FiPlus /> New Project
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Repository</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-500">Loading projects...</td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-500">
                      No projects found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr 
                      key={project.id} 
                      onClick={() => setViewingProject(project)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <FiServer size={18} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{project.name}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{project.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FiGithub size={16} />
                          {project.repository}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${project.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                          {project.status === 'Active' && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={(e) => handleEdit(project, e)} className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors mr-2">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={(e) => handleDelete(project.id, e)} className="text-rose-600 hover:text-rose-900 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
            <div className="text-sm text-slate-500">
              Page <span className="font-medium text-slate-900">{page}</span> of <span className="font-medium text-slate-900">{meta.totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages || meta.totalPages === 0}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewingProject && (
        <ProjectDetailsSlideOver 
          project={viewingProject} 
          onClose={() => setViewingProject(null)} 
        />
      )}

      {isModalOpen && (
        <ProjectModal 
          project={editingProject} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

function ProjectDetailsSlideOver({ project, onClose }) {
  const [selectedBranch, setSelectedBranch] = useState('main');

  const { data: branches, isLoading: loadingBranches } = useQuery({
    queryKey: ['githubBranches', project.repository],
    queryFn: () => githubApi.getBranches(project.repository),
    retry: false
  });

  const { data: commits, isLoading: loadingCommits } = useQuery({
    queryKey: ['githubCommits', project.repository, selectedBranch],
    queryFn: () => githubApi.getCommits(project.repository, selectedBranch),
    enabled: !!selectedBranch,
    retry: false
  });

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{project.name}</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <FiGithub size={14} /> {project.repository}
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
          <FiX size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {project.repoData && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">Repository Details</h3>
            <p className="text-sm text-indigo-700 mb-3">{project.repoData.description || 'No description provided on GitHub.'}</p>
            <div className="flex gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-white px-2 py-1 rounded-md border border-indigo-200">
                {project.repoData.private ? 'Private' : 'Public'}
              </span>
              <a href={project.repoData.htmlUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-white px-2 py-1 rounded-md border border-indigo-200 hover:bg-indigo-50 transition-colors">
                View on GitHub <FiExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2"><FiGitBranch /> Branches</h3>
            {loadingBranches ? (
              <span className="text-xs text-slate-500">Loading...</span>
            ) : (
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="text-sm border-slate-200 rounded-lg py-1.5 pl-3 pr-8 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {branches?.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><FiGitCommit /> Latest Commits</h3>
          {loadingCommits ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !commits || commits.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No commits found.</p>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pb-4">
              {commits.map(commit => (
                <div key={commit.sha} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-indigo-500" />
                  <div className="text-sm font-medium text-slate-900">{commit.message.split('\n')[0]}</div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{commit.author}</span>
                    <span className="flex items-center gap-1"><FiClock size={10} /> {new Date(commit.date).toLocaleDateString()}</span>
                    <a href={commit.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{commit.sha.substring(0, 7)}</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const [form, setForm] = useState(project || { name: '', repository: '', description: '', status: 'Active' });
  const [githubToken, setGithubToken] = useState('');
  const queryClient = useQueryClient();

  const { data: repos, isLoading: loadingRepos, error: repoError } = useQuery({
    queryKey: ['githubRepos'],
    queryFn: githubApi.getRepositories,
    retry: false
  });

  const saveTokenMutation = useMutation({
    mutationFn: githubApi.saveToken,
    onSuccess: () => queryClient.invalidateQueries(['githubRepos'])
  });

  const saveProjectMutation = useMutation({
    mutationFn: (data) => project ? projectsApi.update({ id: project.id, data }) : projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    // Find the full repo object to send as repoData
    if (repos && payload.repository) {
      const repoObj = repos.find(r => r.fullName === payload.repository);
      if (repoObj) payload.repoData = repoObj;
    }
    saveProjectMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">{project ? 'Edit Project' : 'Create New Project'}</h2>
        
        {repoError && (
          <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
            <h3 className="text-sm font-semibold flex items-center gap-2"><FiGithub /> Connect GitHub</h3>
            <p className="mt-1 text-xs text-slate-500">Provide a Personal Access Token to list your repositories.</p>
            <div className="mt-3 flex gap-2">
              <input 
                type="password" 
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button 
                type="button"
                onClick={() => saveTokenMutation.mutate(githubToken)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Repository</label>
            {repos && repos.length > 0 ? (
              <select required value={form.repository} onChange={(e) => setForm({...form, repository: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <option value="">Select a repository...</option>
                {repos.map(r => <option key={r.id} value={r.fullName}>{r.fullName}</option>)}
              </select>
            ) : (
              <input required type="text" value={form.repository} onChange={(e) => setForm({...form, repository: e.target.value})} placeholder="owner/repo" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="3" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={saveProjectMutation.isPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
              {saveProjectMutation.isPending ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
