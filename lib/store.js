import EventEmitter from "events";

class Store extends EventEmitter {
   constructor() {
      super();
      this.tasks = [];
   }

   addTask(taskText) {
      const task = { text: taskText, completed: false };
      this.tasks.push(task);
      this.emit("tasksUpdated", this.tasks);
   }

   markTaskAsCompleted(index) {
      if (this.tasks[index]) {
         this.tasks[index].completed = true;
         this.emit("tasksUpdated", this.tasks);
      }
   }

   deleteTask(index) {
      if (this.tasks[index]) {
         this.tasks.splice(index, 1);
         this.emit("tasksUpdated", this.tasks);
      }
   }
}

export default Store;