
class Store {
  constructor() {
    this._tasks = [
      { text: "$ node index.js <32-character-key> to start", completed: false },
      { text: "[up] and [down] to navigate", completed: false },
      { text: "Press [c] to check", completed: true },
      { text: "Press [a] to add", completed: false },
      { text: "Press [d] to delete", completed: false },
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