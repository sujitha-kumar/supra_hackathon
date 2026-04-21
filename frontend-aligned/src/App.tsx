import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout';
import { ErrorBoundary } from './components/ui';
import {
  LoginPage,
  HomePage,
  ClientsListPage,
  ClientProfilePage,
  LiveChatPage,
  ConversationHistoryPage,
  TasksPage,
  TaskCreatePage,
  AnalyticsPage,
  SettingsPage,
} from './pages';
import CopilotChatPage from './pages/CopilotChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/*"
          element={
            <>
              <Sidebar />
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route
                  path="/home"
                  element={
                    <ErrorBoundary
                      title="Home page unavailable"
                      message="We hit an issue while rendering your dashboard. Reload to try again."
                    >
                      <HomePage />
                    </ErrorBoundary>
                  }
                />
                <Route path="/clients" element={<ClientsListPage />} />
                <Route
                  path="/clients/:id"
                  element={
                    <ErrorBoundary
                      title="Client profile unavailable"
                      message="This client section crashed unexpectedly. Reload and we will restore the profile."
                    >
                      <ClientProfilePage />
                    </ErrorBoundary>
                  }
                />
                <Route path="/chat" element={<LiveChatPage />} />
                <Route path="/copilot-chat" element={<CopilotChatPage />} />
                <Route path="/history" element={<ConversationHistoryPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/create" element={<TaskCreatePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
