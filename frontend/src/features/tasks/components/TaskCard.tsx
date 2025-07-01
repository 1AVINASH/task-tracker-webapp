// src/features/home/components/Banner.tsx
const TaskCard = () => {
  return (
    <div className="bg-blue-400 p-4 rounded w-[1000px]">
      <div>
      <h1 className="text-2xl font-semibold mb-2">Title</h1>
      <p>Body</p>
    </div>
    <button className="m-1 bg-red-600 p-3 text-white"> Delete </button>
    <button className="m-1 bg-red-600 p-3 text-white"> Edit </button>
    <button className="m-1 bg-red-600 p-3 text-white"> Start Timer </button>
    <button className="m-1 bg-red-600 p-3 text-white"> Set Reminder </button>
    </div>
  );
};

export default TaskCard;
