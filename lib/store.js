
class Store {
  constructor() {
    this.tasks = [
      { text: "Buy milk", completed: false },
      { text: "Pay rent", completed: true },
      { text: "Finish coding tutorial", completed: false },
      { text: "Write a book review", completed: false },
    ];
  }
  addTask(taskText) {
    const task = { text: taskText, completed: false };
    this.tasks.push(task);
    return task;
  }
  setCompleted(index) {
    if (this.tasks[index]) {
      this.tasks[index].completed = !this.tasks[index].completed;
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