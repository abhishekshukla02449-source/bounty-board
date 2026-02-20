import { sendAlgo, releaseBounty } from "./utils/algorand";
import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  // Add new task + fund escrow
  const addTask = async (task) => {
    setTasks([...tasks, task]);

    // Example escrow funding (replace with your own TestNet details)
    const sender = "YOUR_TESTNET_ADDRESS";       // Your Algorand TestNet account
    const receiver = "ESCROW_CONTRACT_ADDRESS";  // Escrow or another test account
    const sk = "YOUR_SECRET_KEY";                // Private key (⚠️ keep safe, don’t commit to GitHub)

    try {
      const txId = await sendAlgo(sender, receiver, task.payment, sk);
      console.log("Escrow funded, txId:", txId);
    } catch (error) {
      console.error("Funding failed:", error);
    }
  };

  // Mark task completed + release bounty
  const markCompleted = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = "Completed";
    setTasks(updatedTasks);

    // Example bounty release (replace with your own TestNet details)
    const sender = "ESCROW_CONTRACT_ADDRESS";   // Escrow account
    const receiver = "WORKER_ADDRESS";          // The worker’s Algorand account
    const sk = "ESCROW_SECRET_KEY";             // Escrow private key

    try {
      const txId = await releaseBounty(sender, receiver, updatedTasks[index].payment, sk);
      console.log("Bounty released, txId:", txId);
    } catch (error) {
      console.error("Release failed:", error);
    }
  };

  // Delete task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h1>Welcome to the Micro‑Task Bounty Board</h1>
      <p>Post tasks, claim them, and earn ALGO instantly!</p>

      <TaskForm onAddTask={addTask} />

      <div className="section">
        <h2>🕒 Pending Tasks</h2>
        <TaskList
          tasks={tasks.filter((t) => t.status === "Pending")}
          onComplete={markCompleted}
          onDelete={deleteTask}
        />
      </div>

      <div className="section">
        <h2>✅ Completed Tasks</h2>
        <TaskList
          tasks={tasks.filter((t) => t.status === "Completed")}
          onComplete={markCompleted}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
  