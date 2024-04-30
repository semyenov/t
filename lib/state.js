// StateManager.js

class StateManager {
  constructor() {
    this.listeners = {};
    this.state = {
      tasks: [
        { text: "$> node index.js <32-character-key> to start", completed: true },
        { text: "[up] and [down] to navigate", completed: false },
        { text: "Press [c] to check", completed: true },
        { text: "Press [a] to add", completed: false },
        { text: "Press [d] to delete", completed: false },
      ],
      selectedTaskIndex: null,
      status: ' connecting  ',
    };
  }

  // Method to get the current state
  getStatus() {
    return this.state.status;
  }

  // Method to set the status
  setStatus(status) {
    this.state.status = status;
    this.emit('statusUpdated');
  }

  // Method to get the tasks
  get tasks() {
    return this.state.tasks;
  }

  // Method to add a task
  addTask(text) {
    const task = { text, completed: false };
    this.state.tasks.push(task);
    this.emit('tasksUpdated');

    return task
  }

  // Method to get a task
  getTask(index) {
    if (index >= 0 && index < this.state.tasks.length) {
      return this.state.tasks[index];
    }
  }

  // Method to get a tasks array length
  getTasksLength() {
    return this.state.tasks.length;
  }

  // Method to update a task
  updateTask(index, updatedTask) {
    if (index >= 0 && index < this.state.tasks.length) {
      this.state.tasks[index] = { ...updatedTask };
      this.emit('tasksUpdated');
    }
  }

  // Method to delete a task
  deleteTask(index) {
    if (index >= 0 && index < this.state.tasks.length) {
      this.state.tasks.splice(index, 1);
      this.emit('tasksUpdated');
    }
  }

  // Method to set the selected task index
  setSelectedTaskIndex(index) {
    this.state.selectedTaskIndex = index;
    this.emit('selectedTaskIndexUpdated');
  }

  // Method to subscribe to state changes
  subscribe(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  // Method to emit state change events
  emit(eventName, data) {
    const callbacks = this.listeners[eventName];
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Method to get the current state
  getState() {
    return this.state;
  }
}

// Export a singleton instance of the StateManager
export default new StateManager();