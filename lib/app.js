import blessed from "blessed";
import EventEmitter from "events";

class Tasks extends EventEmitter {
  constructor(store) {
    super();
    this.store = store;
    this.initUI();
    this.bindEvents();
    this.update();
  }

  initUI() {
    this.screen = blessed.screen({
      smartCSR: true,
      autoPadding: true,
      title: "Task Manager with Hyperswarm",
      log: "debug.log",
      terminal: 'xterm-256color',
      fullUnicode: true,
      cursor: {
        artificial: true,
        shape: 'underline',
        blink: true,
        color: null // null for default
      }
    });

    this.tasksList = blessed.list({
      parent: this.screen,
      items: [],
      keys: true,
      vi: true,
      mouse: true,
      style: {
        selected: { bold: true, bg: 'gray' },
        item: { bold: false }
      },
      border: { type: 'line' },
      scrollable: true,
      alwaysScroll: true,
      label: " Hyperswarm Tasks List ",
      padding: { top: 1, bottom: 1, left: 0, right: 0 },
      top: 1,
      left: 2,
      bottom: 1,
      right: 2,
      selectedIndex: 0,
      focused: true,
    });

    this.textBox = blessed.textbox({
      parent: this.screen,
      hidden: true,
      inputOnFocus: true,
      label: " Add Task ",
      keyable: true,
      top: 'center',
      left: 'center',
      width: '75%',
      height: 5,
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      border: { type: 'line' },
      style: { transparent: true, border: { fg: '#f0f0f0' } }
    });

    this.statusBar = blessed.box({
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
    this.tasksList.key("c", () => this.setCompleted());
    this.tasksList.on('select item', (_, index) => this.tasksList.select(index));
    this.tasksList.key("a", () => this.showAddTask());

    this.textBox.key(["C-c"], () => process.exit(0));
    this.textBox.on('cancel', () => this.hideAddTask());
    this.textBox.on('submit', (text) => this.addTask(text));

    this.screen.key(["escape", "q", "C-c"], () => process.exit(0));
  }

  update() {
    const tasks = this.store.tasks.map(task => taskFormatter(task));
    this.tasksList.setItems(tasks);
    this.screen.render();
  }

  addTask(text) {
    const task = this.store.addTask(text);
    this.tasksList.insertItem(this.store.tasks.length, taskFormatter(task));
    this.hideAddTask();
    this.screen.render();
  }

  setCompleted() {
    const index = this.tasksList.selected; // Use the tasksList's selected index
    if (index !== -1) {
      const task = this.store.setCompleted(index);
      this.tasksList.setItem(index, taskFormatter(task));
      this.screen.render();
    }
  }

  deleteTask() {
    const index = this.tasksList.selected;
    if (index !== -1) {
      this.store.deleteTask(index);
      this.tasksList.spliceItem(index, 1);
      this.screen.render();
    }
  }

  showAddTask() {
    this.textBox.show();
    this.textBox.focus();
    this.screen.render();
  }

  hideAddTask() {
    this.textBox.clearValue();
    this.textBox.hide();
    this.screen.render();
  }
}

function taskFormatter(task) {
  return ` ${task.completed ? "" : "·"} ${task.text}`;
}

export default Tasks;