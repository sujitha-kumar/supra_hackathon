import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout';
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
                <Route path="/home" element={<HomePage />} />
                <Route path="/clients" element={<ClientsListPage />} />
                <Route path="/clients/:id" element={<ClientProfilePage />} />
                <Route path="/chat" element={<LiveChatPage />} />
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
