import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../services/auth.api';
import { clearSession, setCredentials } from '../store/authSlice';

export function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const initialized = useSelector((state) => state.auth.initialized);
  useEffect(() => {
    authApi.refresh().then((data) => dispatch(setCredentials(data))).catch(() => dispatch(clearSession()));
  }, [dispatch]);
  if (!initialized) return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Restoring your session…</div>;
  return children;
}
