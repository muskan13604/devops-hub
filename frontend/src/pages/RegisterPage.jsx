import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { authApi } from '../services/auth.api';
import { setCredentials } from '../store/authSlice';
import { AuthCard, Input } from './LoginPage';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export function RegisterPage() { 
  const [form, setForm] = useState({ email: '', password: '' }); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const mutation = useMutation({ 
    mutationFn: authApi.register, 
    onSuccess: (data) => { dispatch(setCredentials(data)); navigate('/'); } 
  }); 

  return (
    <AuthCard title="Create your account" subtitle="Start managing your delivery operations.">
      <form onSubmit={(event) => { event.preventDefault(); mutation.mutate(form); }} className="space-y-5">
        <Input icon={FiMail} label="Work Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} placeholder="you@company.com" />
        <Input icon={FiLock} label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} hint="Use at least 8 characters." placeholder="••••••••" />
        
        {mutation.error && (
          <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200 flex items-center gap-2 animate-in slide-in-from-top-1">
            <span className="font-medium">Error:</span> {mutation.error.response?.data?.error?.message || 'Unable to create account.'}
          </div>
        )}
        
        <button disabled={mutation.isPending} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-500/30 transition-all duration-200 disabled:opacity-70">
          {mutation.isPending ? 'Creating account…' : (
            <span className="flex items-center gap-2">
              Create account <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account? <Link className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors" to="/login">Sign in</Link>
      </p>
    </AuthCard>
  ); 
}
