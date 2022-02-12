import React, { useEffect, useState } from "react";

// defining type for task
interface tasks {
  name: string;
  id: number;
}
// getting data from local storage
const myTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

const App: React.FC = () => {
  const [tasks, setTasks] = useState<tasks[]>(myTasks);
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  //storing value on local Storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // clearing error Message
  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setError(false);
    }, 2000);
    return () => clearTimeout(errorTimeout);
  }, [error]);

  // Adding a new Task
  const addTask = () => {
    // checking for empty input
    if (newTask.length === 0) {
      setError(true);
      return;
    }
    // checking if the data is being edited
    if (isEditing && newTask) {
      const editedTasks = tasks.map((task) => {
        if (task.id === editId) {
          console.log(newTask);

          return { ...task, name: newTask };
        }
        return task;
      });
      setTasks(editedTasks);
      setEditId(null);
      setNewTask("");
      setIsEditing(false);
      return;
    }
    setTasks([...tasks, { name: newTask, id: Date.now() }]);
    setNewTask("");
  };

  //deleting the task
  const deleteTaskHandler = (id: Number) => {
    const updatedTask = tasks.filter((task) => task.id !== id);
    setTasks(updatedTask);
  };

  // deleting all Tasks
  const clearTaskHandler = () => {
    setTasks([]);
  };

  // editing data
  const editIdHandler = (id: number) => {
    const editingTask = tasks.find((item) => item.id === id);
    setEditId(id);
    if (editingTask === undefined) return;
    setNewTask(editingTask.name);
    setIsEditing(true);
  };

  return (
    <>
      <main className="bg-cyan-400 h-screen md:pt-20">
        <section className="h-full md:w-3/5 md:h-4/5 m-auto bg-gray-700 p-10 overflow-auto">
          {error && (
            <p className="text-red-500 py-2">Cannot Enter Empty Value</p>
          )}
          <div className="flex">
            <input
              type="text"
              className="w-4/6 md:w-2/5 rounded-sm outline-0 p-2"
              value={newTask}
              onChange={(e) => {
                setNewTask(e.target.value);
              }}
            />
            <button
              className="ml-3 bg-cyan-400 text-white px-2 py-1 rounded-sm hover:bg-cyan-500"
              onClick={addTask}
            >
              {isEditing ? "Save" : "Add Task"}
            </button>
          </div>
          <div className="text-white">
            <h1 className="font-bold text-2xl my-4">My Tasks</h1>

            {tasks.length === 0 ? (
              <p className="border-t py-4 text-center">No Tasks Found</p>
            ) : (
              tasks.map((task) => {
                const { name, id } = task;
                return (
                  <div className="border-t py-4 grid grid-cols-5" key={id}>
                    <p className="col-span-4">{name}</p>
                    <div className="flex col-span-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-3 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={() => editIdHandler(id)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={() => {
                          deleteTaskHandler(id);
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {tasks.length !== 0 && (
            <button
              className="bg-red-500 text-white px-2 py-2 rounded-sm hover:bg-red-600"
              onClick={clearTaskHandler}
            >
              Clear All Tasks
            </button>
          )}
        </section>
      </main>
    </>
  );
};

export default App;
