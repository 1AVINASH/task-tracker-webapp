// src/routes/AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '../features/tasks';
import { LoginPage } from '../features/tasks';
import { TasksPage } from '../features/tasks';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path=":boardId/tasks" element={<TasksPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
