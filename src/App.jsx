import { useState, useEffect } from "react";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import NewtaskModal from "./components/NewtaskModal";
const columns = ["Backlog", "To-Do", "In Progress", "Done"];

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    taskId: null,
  });
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const setTaskInLocalStorage = (newTasks) => {
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: "Backlog",
    };

    setTasks((prev) => {
      const totalTasks = [...prev, newTask];
      setTaskInLocalStorage(totalTasks);
      return totalTasks;
    });
    setFormData({ title: "", description: "" });
    setIsModalOpen(false);
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => {
      const totalTasks = prev.filter((task) => task.id !== taskId);
      setTaskInLocalStorage(totalTasks);
      return totalTasks;
    });
    setDeleteConfirm({ show: false, taskId: null });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) => {
      const totalTasks = prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTaskInLocalStorage(totalTasks);
      return totalTasks;
    });
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnName) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== columnName) {
      updateTaskStatus(draggedTask.id, columnName);
      setDraggedTask(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
        >
          <FaPlusCircle size={20} /> Add Task
        </button>
      </header>
      <div className="flex flex-1 p-4 gap-4 overflow-auto">
        {columns.map((columnName) => (
          <div
            key={columnName}
            className="flex-1 bg-gray-200 rounded-lg flex flex-col min-w-64"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnName)}
          >
            <div className="p-3 font-bold bg-gray-300 rounded-t-lg">
              {columnName} ({tasks.filter((t) => t.status === columnName).length}
              )
            </div>
            <div className="flex-1 p-2 overflow-y-auto">
              {tasks
                .filter((task) => task.status === columnName)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-3 mb-2 rounded shadow cursor-grab"
                    draggable
                    onDragStart={() => handleDragStart(task)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800">
                        {task.title}
                      </h3>
                      <button
                        onClick={() =>
                          setDeleteConfirm({ show: true, taskId: task.id })
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <NewtaskModal
          setIsModalOpen={setIsModalOpen}
          handleAddTask={handleAddTask}
          handleInputChange={handleInputChange}
          formData={formData}
        />
      )}
      {deleteConfirm.show && (
        <DeleteConfirmModal
          setDeleteConfirm={setDeleteConfirm}
          deleteTask={deleteTask}
          deleteConfirm={deleteConfirm}
        />
      )}
    </div>
  );
}
