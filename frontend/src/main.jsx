import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { store } from './store';
import { clearSession, setCredentials } from './store/authSlice';
import { authApi } from './services/auth.api';
import { configureHttp } from './services/http';
import { AuthBootstrap } from './app/AuthBootstrap';
import './styles/index.css';

configureHttp({ getToken: () => store.getState().auth.accessToken, refresh: async () => { const data = await authApi.refresh(); store.dispatch(setCredentials(data)); return data.accessToken; }, onExpired: () => store.dispatch(clearSession()) });
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });
createRoot(document.getElementById('root')).render(<StrictMode><Provider store={store}><QueryClientProvider client={queryClient}><BrowserRouter><AuthBootstrap><App /></AuthBootstrap></BrowserRouter></QueryClientProvider></Provider></StrictMode>);
