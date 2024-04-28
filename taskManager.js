const blessed = require("blessed");
const EventEmitter = require("events");

class TaskManager extends EventEmitter {
  constructor(mediator) {
    super();

    this.mediator = mediator;
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Task Manager with Hyperswarm",
    });

    this.cursor = 0;
    this.tasks = [];
    this.taskList = null;
    this.renderTasks();
    this.screen.on("error", (err) => console.error(err));

    // Обработка событий клавиатуры
    this.screen.key(["escape", "q", "C-c"], () => process.exit(0));
    this.screen.key("a", () => this.addTask());
    this.screen.key("d", () => this.deleteTask());
    this.screen.key("c", () => this.markTaskAsCompleted(this));
  }

  updateTasks(tasks) {
    this.tasks = tasks;
    this.renderTasks();
  }

  addTask(taskText) {
    console.log("addTask", taskText);
    this.tasks.push({ text: taskText, completed: false });
    this.renderTasks();
    // Используем Mediator для добавления задачи
    this.mediator.emit("addTask", taskText);
  }

  markTaskAsCompleted(index) {
    if (this.tasks[index]) {
      this.tasks[index].completed = true;
      this.renderTasks();
      // Используем Mediator для отметить задачу как выполненную
      this.mediator.emit("markTaskAsCompleted", index);
    }
  }

  deleteTask(index) {
    if (this.tasks[index]) {
      this.tasks.splice(index, 1);
      this.renderTasks();
      // Используем Mediator для удаления задачи
      this.mediator.emit("deleteTask", index);
    }
  }

  renderTasks() {
    if (this.taskList) {
      this.screen.remove(this.taskList);
    }

    this.taskList = blessed.list({
      parent: this.screen,
      top: "center",
      left: "center",
      width: "50%",
      height: "50%",
      items: this.tasks.map(
        (task, index) =>
          `${index + 1}. ${task.text} ${task.completed ? "(completed)" : ""}`
      ),
      keys: true,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "#f0f0f0",
        },
      },
    });

    this.taskList.on("select", (item, index) => {
      console.log(`selected`, item, index);
      this.markTaskAsCompleted(index); // Используем Mediator для отметить задачу как выполненную
      // Здесь можно добавить логику для редактирования или удаления выбранной задачи
    });

    this.screen.append(this.taskList);
    this.screen.render();
  }
}

module.exports = TaskManager;
