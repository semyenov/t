import TaskManager from './lic/taskManager.js';
import NetworkManager from './lic/networkManager.js';
import Mediator from './lic/mediator.js';

const mediator = new Mediator();
const taskManager = new TaskManager(mediator);
const networkManager = new NetworkManager(mediator);

// Подписываемся на события от NetworkManager через Mediator
mediator.on('tasksUpdated', taskManager.updateTasks.bind(taskManager));

