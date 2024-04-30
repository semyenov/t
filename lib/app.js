import blessed from "blessed";
import EventEmitter from "events";

class App extends EventEmitter {
  constructor(store, network) {
    super();
    this.store = store;
    this.network = network;

    this.screen = this.initScreen();
    this.tasksList = this.createTasksList();
    this.taskView = this.createTaskView();
    this.textBox = this.createTextBox();
    this.statusBar = this.createStatusBar();

    this.network.on("setStatus", (status) => {
      this.statusBar.setLabel(status);
      this.updateUI();
    })

    this.network.on("addTask", (task) => {
      this.store.addTask(task.text);
      this.update();
    })

    this.network.on("putTask", ({ index, task }) => {
      this.store.putTask(index, task);
      this.update();
    })

    this.network.on("deleteTask", (index) => {
      this.store.deleteTask(index);
      this.update();
    })

    this.init();
  }

  init() {
    this.bindEvents();
    this.update();
    this.debounceTimeout = null;
  }

  initScreen() {
    return blessed.screen({
      smartCSR: true,
      useBCE: true,
      autoPadding: true,
      title: "Task Manager with Hyperswarm",
      debug: true,
      log: "debug.log",
      terminal: 'xterm-256color',
      fullUnicode: true,
      cursor: {
        artificial: true,
        shape: 'underline',
        blink: true,
        color: null
      }
    })
  }

  createTasksList() {
    return blessed.list({
      parent: this.screen,
      items: [],
      vi: true,
      keys: true,
      tags: true,
      mouse: true,
      style: {
        selected: { bold: true, bg: 'gray' },
        item: { bold: false }
      },
      border: { type: 'line' },
      scrollable: true,
      alwaysScroll: true,
      label: " Hyperswarm Tasks List  ",
      padding: { top: 1, bottom: 1, left: 0, right: 0 },
      top: 1,
      left: 2,
      right: 2,
      height: '50%+2',
      selectedIndex: 0,
      focused: true,
    });
  }

  createTaskView() {
    return blessed.textbox({
      parent: this.screen,
      label: " Task Details ",
      height: 'shrink',
      left: 'center',
      top: '50%+2',
      left: 2,
      bottom: 1,
      right: 2,
      wrap: true,
      scrollable: true,
      alwaysScroll: true,
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      border: {
        type: 'line'
      },
      style: {
        bg: 'gray',
        fg: 'white'
      },
    });
  }

  createTextBox() {
    return blessed.textbox({
      parent: this.screen,
      hidden: true,
      inputOnFocus: true,
      label: " Add Task ",
      keyable: true,
      left: 2,
      right: 2,
      bottom: 1,
      height: 'shrink',
      wrap: true,
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      border: { type: 'line' },
    });
  }

  createStatusBar() {
    return blessed.box({
      parent: this.screen,
      align: 'center',
      label: " [a]add · [d]elete · [c]omplete · [q]uit ",
      bottom: 1,
      left: 2,
      right: 2,
      height: 1,
      border: { type: 'line' },
    });
  }

  bindEvents() {
    this.tasksList.key("d", () => this.deleteTask());
    this.tasksList.key("c", () => this.putTask());
    this.tasksList.key("a", () => this.showAddTask());
    this.tasksList.on('select item', (_, index) => this.selectTask(index));
    this.taskView.key("escape", () => this.taskView.hide());
    this.textBox.key(["C-c"], () => process.exit(0));
    this.textBox.on('cancel', () => this.hideAddTask());
    this.textBox.on('submit', (text) => this.addTask(text));
    this.screen.key(["escape", "q", "C-c"], () => process.exit(0));
  }

  update() {
    try {
      const tasks = this.store.tasks.map(task => taskFormatter(task));
      this.tasksList.setItems(tasks);
      this.screen.render();
    } catch (error) {
      this.showError("Failed to update tasks: " + error.message);
    }
  }

  async addTask(text) {
    // try {
    const task = await this.store.addTask(text);
    this.screen.log("Added task: " + text);
    this.network.broadcast("addTask", task)
    this.tasksList.insertItem(this.store.tasks.length, taskFormatter(task));
    this.hideAddTask();
    this.updateUI();
    // } catch (error) {
    //   this.showError("Failed to add task: " + error.message);
    // }
  }

  putTask() {
    // try {
    const index = this.tasksList.selected;
    if (index !== -1) {
      const task = this.store.getTask(index);
      this.store.putTask(index, { ...task, completed: !task.completed });
      this.tasksList.setItem(index, taskFormatter({ ...task, completed: !task.completed }));
      this.network.broadcast("putTask", { index, task: { ...task, completed: !task.completed } });
      this.updateUI();
    }
    // } catch (error) {
    //   this.showError("Failed to set task as completed: " + error.message);
    // }
  }

  deleteTask() {
    // try {
    const index = this.tasksList.selected;
    if (index !== -1) {
      this.store.deleteTask(index);
      this.tasksList.spliceItem(index, 1);
      this.network.broadcast("deleteTask", index);
      this.updateUI();
    }
    // } catch (error) {
    //   this.showError("Failed to delete task: " + error.message);
    // }
  }

  selectTask() {
    // try {
    const index = this.tasksList.selected;
    this.taskView.setContent(`${this.store.tasks[index].text}`);
    this.updateUI();
    // } catch (error) {
    //   this.showError("Failed to select task: " + error.message);
    // }
  }

  showAddTask() {
    this.textBox.show();
    this.textBox.focus();
    this.updateUI();
  }

  hideAddTask() {
    this.textBox.clearValue();
    this.textBox.hide();
    this.updateUI();
  }

  updateUI() {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.tasksList.render();
      this.taskView.render();
      this.statusBar.render();
    }, 100);
  }

  showError(message) {
    this.statusBar.setContent(message);
    this.statusBar.render();
  }
}

function taskFormatter(task) {
  return ` ${task.completed ? "{green-fg}{/green-fg}" : "{red-fg}·{/red-fg}"} ${task.text}`;
}

export default App;