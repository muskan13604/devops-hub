import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiActivity, FiBox, FiGrid, FiLogOut, FiSettings, FiShield } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../services/auth.api';
import { clearSession } from '../store/authSlice';

const navItems = [{ to: '/', label: 'Overview', icon: FiGrid }, { to: '/projects', label: 'Projects', icon: FiBox }, { to: '/activity', label: 'Activity', icon: FiActivity }];

export function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async () => { try { await authApi.logout(); } finally { dispatch(clearSession()); navigate('/login'); } };
  return <div className="min-h-screen bg-slate-50 lg:flex">
    <aside className="flex w-full flex-col bg-slate-950 px-4 py-5 text-slate-300 lg:min-h-screen lg:w-64">
      <div className="mb-10 flex items-center gap-3 px-2 text-white"><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-500"><FiShield /></span><span className="font-semibold">DevOpsHub AI</span></div>
      <nav className="flex flex-1 gap-1 lg:flex-col">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-indigo-500 text-white' : 'hover:bg-slate-800'}`}><Icon />{label}</NavLink>)}</nav>
      <button onClick={logout} className="mt-5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-800"><FiLogOut />Sign out</button>
    </aside>
    <main className="min-w-0 flex-1"><header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6"><div className="text-sm text-slate-500">Workspace / <span className="font-medium text-slate-800">Dashboard</span></div><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><FiSettings /></button><div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{user.email.slice(0, 1).toUpperCase()}</div></div></header><div className="p-6 lg:p-8"><Outlet /></div></main>
  </div>;
}
