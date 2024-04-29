import { EventEmitter } from "events";
import Hyperswarm from "hyperswarm";

class NetworkManager extends EventEmitter {
  constructor(mediator) {
    super();
    this.swarm = new Hyperswarm();
    this.mediator = mediator;
    this.tasks = [];

    this.key = Buffer.from('RgZL+6keXxreYR/pwReYs9jKASOMNNw9Nu1I3vbMHFA=');
    this.swarm.join(this.key, { announce: true, lookup: true });

    this.swarm.on("connection", this.handleConnection);
    this.swarm.on("error", (err) => this.emit("error", err));
  }

  handleConnection = (connection, info) => {
    console.log("Connected to another peer!", info);

    connection.on("data", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("Received:", message);

        switch (message.type) {
          case "addTask":
            this.addTask(message.task);
            break;
          case "setCompleted":
            this.setCompleted(message.index);
            break;
          case "deleteTask":
            this.deleteTask(message.index);
            break;
          default:
            console.log("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });
  };

  addTask(taskText) {
    this.tasks.push({ text: taskText, completed: false });
    this.mediator.emit('updateTasks', this.tasks);
  };

  setCompleted(index) {
    if (this.tasks[index]) {
      this.tasks[index].completed = true;
      this.mediator.emit('updateTasks', this.tasks);
    }
  };

  deleteTask(index) {
    if (this.tasks[index]) {
      this.tasks.splice(index, 1);
      this.mediator.emit('updateTasks', this.tasks);
    }
  };
}

export default NetworkManager;
