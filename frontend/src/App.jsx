import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() { return <Routes><Route element={<ProtectedRoute />}><Route element={<DashboardLayout />}><Route path="/" element={<DashboardPage />} /><Route path="/projects" element={<PlaceholderPage title="Projects" />} /><Route path="/activity" element={<PlaceholderPage title="Activity" />} /></Route></Route><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>; }
