import { FiTrendingUp, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const metrics = [
  { label: 'Active projects', value: '12', note: '+2 this month', icon: FiActivity, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: 'text-emerald-600' },
  { label: 'Deployments', value: '148', note: '98.6% successful', icon: FiTrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: 'text-emerald-600' },
  { label: 'Open incidents', value: '3', note: 'Needs attention', icon: FiAlertCircle, color: 'text-rose-600', bg: 'bg-rose-100', trend: 'text-rose-600' }
];

export function DashboardPage() { 
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="mb-10">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 mb-4">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
          DevOpsHub AI Insights
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Operations overview</h1>
        <p className="mt-3 text-base text-slate-500 max-w-2xl">
          Your engineering delivery health, at a glance. Monitor active projects, deployments, and incidents in real-time.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric, i) => (
          <article 
            key={metric.label} 
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                <p className="mt-4 text-4xl font-bold text-slate-900 tracking-tight">{metric.value}</p>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-full ${metric.bg} ${metric.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <metric.icon size={24} />
              </div>
            </div>
            <div className="relative mt-4 flex items-center text-sm font-medium">
              <span className={metric.trend}>{metric.note}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">Deployment activity</h2>
          <p className="mt-1 text-sm text-slate-500">Real-time feed of recent deployments across all environments.</p>
        </div>
        <div className="p-6">
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-200 text-slate-400 mb-4">
              <FiActivity size={24} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No projects connected</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">Connect a project or repository to start seeing deployment analytics and real-time activity.</p>
            <Link to="/projects" className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 transition-colors hover:bg-indigo-700">
              Connect Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  ); 
}
