import blessed from "blessed";
import EventEmitter from "events";

class TaskManager extends EventEmitter {
  constructor(mediator) {
    super();

    this.screen = blessed.screen({
      smartCSR: true,
      title: "Task Manager with Hyperswarm",
    });

    this.tasks = [];

    this.renderTasks();
    this.bindKeys();
    this.screen.on("error", (err) => this.emit("error", err));

    this.mediator = mediator;
    this.mediator.on("tasksUpdated", this.updateTasks.bind(this));
  }

  updateTasks(tasks) {
    this.tasks = tasks;
    this.renderTasks();
  }

  bindKeys() {
    this.screen.key(["escape", "q", "C-c"], () => process.exit(0));
    this.screen.key("a", this.addTask.bind(this));
    this.screen.key("d", this.deleteTask.bind(this));
    this.screen.key("c", this.markTaskAsCompleted.bind(this));
  }

  addTask() {
    const taskText = `Added task ${Math.random()}`;
    this.mediator.emit("addTask", taskText);
  }

  markTaskAsCompleted(index) {
    this.mediator.emit("markTaskAsCompleted", index);
  }

  deleteTask(index) {
    this.mediator.emit("deleteTask", index);
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
        (task, index) => `${index + 1}. ${task.text} ${task.completed ? "(completed)" : ""}`
      ),
      keys: true,
      border: "line",
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "#f0f0f0"
        }
      }
    });

    this.taskList.on("select", (_, index) => this.markTaskAsCompleted(index));

    this.screen.append(this.taskList);
    this.screen.render();
  }
}

export default TaskManager;
