// src/features/home/pages/Home.tsx
import Project from '../features/tasks/components/header/ProjectTitle';
import Tasks from '../features/tasks/components/Tasks';

const TasksPage = () => {
  return (
    <div>
      <Project />
      <Tasks />
    </div>
  );
};

export default TasksPage;
