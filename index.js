import Tasks from "./lib/app.js";
import Store from "./lib/store.js";

const store = new Store();
const renderer = new Tasks(store);

// store.on("tasksUpdated", (tasks) => {
//     renderer.updateTasks(tasks);
// });

// import Network from './lib/network.js';
//
// const mediator = new Mediator();
// const taskManager = new TaskManager(mediator);
// const network = new Network(mediator);

// // Подписываемся на события от Network через Mediator
// mediator.on('tasksUpdated', taskManager.updateTasks.bind(taskManager));

// // Подписываемся на события от TaskManager через Mediator и Network
// network.on('addTask', taskManager.addTask.bind(taskManager));
