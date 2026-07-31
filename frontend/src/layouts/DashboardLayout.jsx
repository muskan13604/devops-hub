import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiActivity, FiBox, FiGrid, FiLogOut, FiSettings, FiShield, FiBell, FiSearch, FiCloudLightning, FiCpu, FiMessageSquare } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../services/auth.api';
import { clearSession } from '../store/authSlice';

const navItems = [
  { to: '/', label: 'Overview', icon: FiGrid },
  { to: '/projects', label: 'Projects', icon: FiBox },
  { to: '/repositories', label: 'Repositories', icon: FiGithub },
  { to: '/docker', label: 'Docker Engine', icon: FiBox },
  { to: '/kubernetes', label: 'Kubernetes', icon: FiLayers },
  { to: '/deployments', label: 'Jenkins Pipelines', icon: FiCloudLightning },
  { to: '/monitoring', label: 'Monitoring', icon: FiCpu },
  { to: '/ai-assistant', label: 'AI Assistant', icon: FiMessageSquare },
  { to: '/settings', label: 'Settings', icon: FiSettings }
];

export function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => { 
    try { 
      await authApi.logout(); 
    } finally { 
      dispatch(clearSession()); 
      navigate('/login'); 
    } 
  };

  return (
    <div className="min-h-screen bg-slate-50/50 lg:flex relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Sidebar */}
      <aside className="glass-dark z-10 flex w-full flex-col px-4 py-6 text-slate-300 lg:min-h-screen lg:w-[280px] transition-all duration-300">
        <div className="mb-12 flex items-center gap-3 px-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <FiShield size={20} className="text-white" />
          </span>
          <span className="font-bold tracking-tight text-lg">DevOpsHub AI</span>
        </div>
        
        <div className="mb-6 px-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
        </div>

        <nav className="flex flex-1 gap-1.5 lg:flex-col">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink 
              key={to} 
              to={to} 
              className={({ isActive }) => 
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="transition-transform group-hover:scale-110" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={logout} 
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400"
          >
            <FiLogOut size={18} className="transition-transform group-hover:-translate-x-1" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 relative z-10 flex flex-col">
        {/* Navbar */}
        <header className="glass sticky top-0 z-20 flex h-20 items-center justify-between px-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-500">
              Workspace <span className="mx-2 text-slate-300">/</span> <span className="text-slate-900">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-10 w-64 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            
            <button className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100 transition-colors">
              <FiBell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
            </button>
            <button className="rounded-full p-2.5 text-slate-500 hover:bg-slate-100 transition-colors">
              <FiSettings size={20} />
            </button>
            
            <div className="ml-2 pl-6 border-l border-slate-200 flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-semibold text-slate-700">{user?.email?.split('@')[0] || 'User'}</span>
                <span className="text-xs text-slate-500">Admin</span>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
                {user?.email?.slice(0, 1).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 pb-16 lg:px-12 lg:py-10 max-w-7xl mx-auto w-full flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
