
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
  async addTask(taskText) {
    const task = { text: taskText, completed: false };
    this.tasks.push(task);
    return task;
  }
  async getTask(index) {
    return this.tasks[index];
  }
  async putTask(index, task) {
    if (this.tasks[index]) {
      this.tasks[index] = task;
      return this.tasks[index];
    }
  }
  async deleteTask(index) {
    if (this.tasks[index]) {
      this.tasks.splice(index, 1);
      return this.tasks[index];
    }
  }
}

export default Store;