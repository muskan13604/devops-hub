import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ProjectsPage } from './pages/ProjectsPage';
import { GitHubReposPage } from './pages/GitHubReposPage';
import { DockerPage } from './pages/DockerPage';
import { DeploymentsPage } from './pages/DeploymentsPage';
import { KubernetesPage } from './pages/KubernetesPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { AiAssistantPage } from './pages/AiAssistantPage';

export default function App() { 
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/repositories" element={<GitHubReposPage />} />
          <Route path="/docker" element={<DockerPage />} />
          <Route path="/kubernetes" element={<KubernetesPage />} />
          <Route path="/deployments" element={<DeploymentsPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ); 
}
