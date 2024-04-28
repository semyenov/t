import blessed from "blessed";

class BlessedRendered {
  constructor(store) {
    this.store = store;
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Task Manager with Hyperswarm",
    });

    this.taskList = null;
  }

  renderTasks(tasks = []) {
    if (!this.taskList) {
      this.taskList = blessed.list({
        parent: this.screen,
        top: "center",
        left: "center",
        width: "95%",
        height: "80%",
        items: tasks.map((task, index) => `${index + 1}. ${task.text} ${task.completed ? "(completed)" : ""}`),
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

      this.screen.append(this.taskList);
    } else {
      this.taskList.setItems(tasks.map((task, index) => `${index + 1}. ${task.text} ${task.completed ? "(completed)" : ""}`));
    }

    this.screen.render();
  }

  bindKeys() {
    this.screen.key(["escape", "q", "C-c"], () => process.exit(0));
    this.screen.key("a", () => this.store.addTask(`Added task ${Math.random()}`));
    this.screen.key("d", (_, index) => this.store.deleteTask(index));
    this.screen.key("c", (_, index) => this.store.markTaskAsCompleted(index));
  }
}

export default BlessedRendered;