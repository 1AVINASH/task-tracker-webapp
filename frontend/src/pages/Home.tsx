// src/features/home/pages/Home.tsx
import Boards from '../features/boards/components/Boards'
import BoardTitle from '../features/boards/components/header/BoardTitle'

const HomePage = () => {
  return (
    <div>
      <BoardTitle />
      <Boards />
    </div>
  );
};

export default HomePage;
