const Hyperswarm = require("hyperswarm");
const EventEmitter = require("events");

class NetworkManager extends EventEmitter {
  constructor(mediator) {
    super();
    this.swarm = new Hyperswarm();
    this.mediator = mediator;
    this.tasks = []; // Внутренний список задач

    // Создаем ключ для входящих соединений
    this.key = Buffer.from(Array.from({ length: 32 }).fill(1));
    this.swarm.join(this.key, { announce: true, lookup: true });

    // Обработка входящих соединений
    this.swarm.on("connection", (connection, info) =>
      this.handleConnection(connection, info)
    );
    this.swarm.on("error", (err) => console.error(err));
  }

  handleConnection(connection, info) {
    console.log("Connected to another peer!", info);

    // Обрабатываем входящие данные
    connection.on("data", (data) => {
      const message = JSON.parse(data.toString());
      console.log("Received:", message);

      // Прямая обработка команд без использования Mediator
      switch (message.type) {
        case "addTask":
          this.addTask(message.task);
          break;
        case "markTaskAsCompleted":
          this.markTaskAsCompleted(message.index);
          break;
        case "deleteTask":
          this.deleteTask(message.index);
          break;
        default:
          console.log("Unknown message type:", message.type);
      }
    });
  }

  addTask(taskText) {
    this.tasks.push({ text: taskText, completed: false });
    this.mediator.updateTasks(this.tasks); // Обновляем список задач через Mediator
  }

  markTaskAsCompleted(index) {
    if (this.tasks[index]) {
      this.tasks[index].completed = true;
      this.mediator.updateTasks(this.tasks); // Обновляем список задач через Mediator
    }
  }

  deleteTask(index) {
    if (this.tasks[index]) {
      this.tasks.splice(index, 1);
      this.mediator.updateTasks(this.tasks); // Обновляем список задач через Mediator
    }
  }
}

module.exports = NetworkManager;