import EventEmitter from "events";

class Store {
   constructor() {
      this.tasks = [
         { text: "Task 1", completed: false },
         { text: "Task 2", completed: true },
         { text: "Task 3", completed: false },
         { text: "Task 4", completed: false },
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
