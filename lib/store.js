
class Store {
  constructor() {
    this._tasks = [
      { text: "Buy milk", completed: false },
      { text: "Pay rent", completed: true },
      { text: "Finish coding tutorial", completed: false },
      { text: "Write a book review", completed: false },
    ];
  }
  get tasks() {
    return this._tasks;
  }
  addTask(taskText) {
    const task = { text: taskText, completed: false };
    this.tasks.push(task);
    return task;
  }
  getTask(index) {
    return this.tasks[index];
  }
  putTask(index, task) {
    if (this.tasks[index]) {
      this.tasks[index] = task;
      return this.tasks[index];
    }
  }
  deleteTask(index) {
    if (this.tasks[index]) {
      this.tasks.splice(index, 1);
      return this.tasks[index];
    }
  }
}

export default Store;