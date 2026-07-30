import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { githubApi } from '../services/github.api';
import { FiGithub, FiStar, FiGitBranch, FiGitCommit, FiX, FiExternalLink, FiClock, FiSearch } from 'react-icons/fi';

export function GitHubReposPage() {
  const [search, setSearch] = useState('');
  const [viewingRepo, setViewingRepo] = useState(null);
  const [githubToken, setGithubToken] = useState('');
  const queryClient = useQueryClient();

  const { data: repos, isLoading, error } = useQuery({
    queryKey: ['githubRepos'],
    queryFn: githubApi.getRepositories,
    retry: false
  });

  const saveTokenMutation = useMutation({
    mutationFn: githubApi.saveToken,
    onSuccess: () => queryClient.invalidateQueries(['githubRepos'])
  });

  const filteredRepos = repos?.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex">
      <div className="flex-1">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">GitHub Repositories</h1>
            <p className="mt-2 text-sm text-slate-500">Browse your connected GitHub repositories and view insights.</p>
          </div>
          
          {repos && !error && (
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search repositories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-64"
              />
            </div>
          )}
        </div>

        {error ? (
          <div className="max-w-md mx-auto mt-12 rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-200 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-600 mb-6">
              <FiGithub size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Connect GitHub</h3>
            <p className="text-sm text-slate-500 mb-6">Provide a Personal Access Token to view and analyze your repositories.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="password" 
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button 
                onClick={() => saveTokenMutation.mutate(githubToken)}
                disabled={saveTokenMutation.isPending || !githubToken}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md"
              >
                {saveTokenMutation.isPending ? 'Connecting...' : 'Connect Account'}
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse h-48 rounded-2xl bg-white border border-slate-200 p-6">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
                <div className="flex gap-4">
                  <div className="h-6 w-16 bg-slate-200 rounded-full" />
                  <div className="h-6 w-16 bg-slate-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map(repo => (
              <div 
                key={repo.id}
                onClick={() => setViewingRepo(repo)}
                className="group relative flex flex-col rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <h3 className="font-bold text-slate-900 text-lg truncate pr-4">{repo.name}</h3>
                  <FiGithub className="text-slate-400 shrink-0 mt-1" size={20} />
                </div>
                
                <p className="text-sm text-slate-500 flex-1 line-clamp-2 mb-6 relative z-10">
                  {repo.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center gap-4 relative z-10">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <FiStar className="text-amber-400 fill-amber-400" size={14} />
                    {repo.stars}
                  </span>
                  <span className={`inline-flex items-center ml-auto text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${repo.private ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {repo.private ? 'Private' : 'Public'}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredRepos.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No repositories found matching "{search}".
              </div>
            )}
          </div>
        )}
      </div>

      {viewingRepo && (
        <RepoDetailsSlideOver 
          repo={viewingRepo} 
          onClose={() => setViewingRepo(null)} 
        />
      )}
    </div>
  );
}

function RepoDetailsSlideOver({ repo, onClose }) {
  const [selectedBranch, setSelectedBranch] = useState('main');

  const { data: branches, isLoading: loadingBranches } = useQuery({
    queryKey: ['githubBranches', repo.fullName],
    queryFn: () => githubApi.getBranches(repo.fullName),
    retry: false
  });

  const { data: commits, isLoading: loadingCommits } = useQuery({
    queryKey: ['githubCommits', repo.fullName, selectedBranch],
    queryFn: () => githubApi.getCommits(repo.fullName, selectedBranch),
    enabled: !!selectedBranch,
    retry: false
  });

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{repo.name}</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <FiGithub size={14} /> {repo.fullName}
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
          <FiX size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-wrap gap-3">
          <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
            View on GitHub <FiExternalLink size={12} />
          </a>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            <FiStar className="fill-amber-500" size={14} /> {repo.stars} Stars
          </span>
          {repo.language && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> {repo.language}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2"><FiGitBranch /> Branches</h3>
            {loadingBranches ? (
              <span className="text-xs text-slate-500">Loading...</span>
            ) : (
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="text-sm border-slate-200 rounded-lg py-1.5 pl-3 pr-8 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
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
