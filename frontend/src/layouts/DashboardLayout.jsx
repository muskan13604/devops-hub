import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiBox, FiGithub, FiCloudLightning, FiSettings, FiLogOut, FiCpu, FiMessageSquare, FiMenu, FiX, FiLayers, FiBell } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { clearSession } from '../store/authSlice';
import { useState, useEffect } from 'react';
import { socket, connectSocket, disconnectSocket } from '../services/socket.client';

const navItems = [
  { to: '/', label: 'Overview', icon: FiHome },
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    connectSocket();

    socket.on('NEW_NOTIFICATION', (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      socket.off('NEW_NOTIFICATION');
      disconnectSocket();
    };
  }, []);

  const handleLogout = () => {
    dispatch(clearSession());
    navigate('/login');
  };
  
  const unreadCount = notifications.length;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex h-16 items-center px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <FiCloudLightning className="text-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">DevOpsHub<span className="text-indigo-600">.ai</span></span>
          </div>
          <button 
            className="ml-auto p-2 text-slate-400 hover:text-slate-600 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="text-lg" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-rose-600 shadow-sm border border-slate-200 hover:bg-rose-50 hover:border-rose-100 transition-all"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8 shadow-sm relative shrink-0">
          <button
            className="p-2 text-slate-500 hover:text-slate-700 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu className="text-2xl" />
          </button>
          
          <div className="flex-1" />
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={() => setNotifications([])} className="text-xs text-indigo-600 font-medium hover:text-indigo-800">Clear All</button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notif, i) => (
                        <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-semibold text-sm text-slate-900">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50 p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
