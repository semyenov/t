const EventEmitter = require("events");

class Mediator extends EventEmitter {
   constructor() {
      super();
   }

   // Метод для обновления списка задач
   updateTasks(tasks) {
      this.emit("tasksUpdated", tasks);
   }
}

module.exports = Mediator;