// src/routes/AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TasksPage, LoginPage, HomePage, FileUploaderPage } from '../pages';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path=":boardId/tasks" element={<TasksPage />} />
      <Route path="/file" element={<FileUploaderPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
