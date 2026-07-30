import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { authApi } from '../services/auth.api';
import { setCredentials } from '../store/authSlice';
import { FiShield, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export function LoginPage() { 
  const [form, setForm] = useState({ email: '', password: '' }); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const mutation = useMutation({ 
    mutationFn: authApi.login, 
    onSuccess: (data) => { dispatch(setCredentials(data)); navigate('/'); } 
  }); 

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your DevOpsHub AI workspace">
      <form onSubmit={(event) => { event.preventDefault(); mutation.mutate(form); }} className="space-y-5">
        <Input icon={FiMail} label="Email Address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} placeholder="you@company.com" />
        <Input icon={FiLock} label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} placeholder="••••••••" />
        
        {mutation.error && (
          <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200 flex items-center gap-2 animate-in slide-in-from-top-1">
            <span className="font-medium">Error:</span> {mutation.error.response?.data?.error?.message || 'Unable to sign in.'}
          </div>
        )}
        
        <button disabled={mutation.isPending} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-500/30 transition-all duration-200 disabled:opacity-70">
          {mutation.isPending ? 'Signing in…' : (
            <span className="flex items-center gap-2">
              Sign in <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-500">
        New here? <Link className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors" to="/register">Create an account</Link>
      </p>
    </AuthCard>
  ); 
}

export function AuthCard({ title, subtitle, children }) { 
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 ring-4 ring-white">
            <FiShield size={28} className="text-white" />
          </span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
        <p className="mt-2 text-center text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
        <div className="glass bg-white/60 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-indigo-100/50 sm:rounded-2xl sm:px-10 border border-white/50">
          {children}
        </div>
      </div>
    </div>
  ); 
}

export function Input({ label, type, value, onChange, placeholder, icon: Icon, hint }) { 
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input 
          required 
          type={type} 
          value={value} 
          onChange={(event) => onChange(event.target.value)} 
          placeholder={placeholder}
          className={`block w-full rounded-xl border-slate-200 bg-white/50 py-3 ${Icon ? 'pl-10' : 'pl-3'} pr-3 text-sm outline-none ring-1 ring-slate-200 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20`} 
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  ); 
}
