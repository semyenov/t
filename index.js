const blessed = require("blessed");
const Hyperswarm = require("hyperswarm");

// Создаем экземпляр Hyperswarm
const swarm = new Hyperswarm();

// Генерируем ключ для идентификации нашей сессии
const key = Buffer.from(Array.from({ length: 32 }).fill(1));

// Подключаемся к сети Hyperswarm
swarm.join(key, {
  announce: true, // Разрешаем объявлять наш узел в сети
  lookup: true, // Разрешаем искать другие узлы
});

// Создаем TUI экран
const screen = blessed.screen({
  smartCSR: true,
  title: "Task Manager with Hyperswarm",
});

// Создаем список задач
let tasks = [];

// Функция для отображения списка задач
function renderTasks() {
  const taskList = blessed.list({
    parent: screen,
    top: "center",
    left: "center",
    width: "50%",
    height: "50%",
    items: tasks.map(
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
    selectedIndex: 0, // Указываем начальный выбранный элемент
  });

  screen.append(taskList);
  screen.render();

  // Обработка выбора элемента
  taskList.on("select", (item, index) => {
    console.log(`Selected task: ${item.content}`);
    // Здесь можно добавить логику для редактирования или удаления выбранной задачи
  });
}

// Функция для добавления новой задачи
function addTask() {
  const prompt = blessed.prompt({
    parent: screen,
    top: "center",
    left: "center",
    width: "50%",
    height: "30%",
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

  screen.append(prompt);
  screen.render();

  prompt.input("Enter task: ", "", (err, taskText) => {
    if (err) return;
    if (taskText.trim() === "") {
      console.log("Task cannot be empty.");
      return;
    }
    tasks.push({ text: taskText, completed: false });
    renderTasks();
    // Отправляем задачу на другие узлы
    if (swarm.connections.length > 0) {
      swarm.connections.forEach((connection) => {
        connection.write(JSON.stringify({ type: "addTask", task: taskText }));
      });
    }
  });
}

// Функция для отмечания задачи как выполненной
function markTaskAsCompleted(index) {
  if (tasks[index]) {
    tasks[index].completed = true;
    renderTasks();
    // Отправляем обновление на другие узлы
    swarm.connections.forEach((connection) => {
      connection.write(JSON.stringify({ type: "markTaskAsCompleted", index }));
    });
  }
}

// Функция для удаления задачи
function deleteTask(index) {
  if (tasks[index]) {
    tasks.splice(index, 1);
    renderTasks();
    // Отправляем обновление на другие узлы
    swarm.connections.forEach((connection) => {
      connection.write(JSON.stringify({ type: "deleteTask", index }));
    });
  }
}

// Обработка событий
screen.key(["escape", "q", "C-c"], () => process.exit(0));
screen.key("a", () => addTask());

// Обработка входящих соединений
swarm.on("connection", (connection, info) => {
  console.log("Connected to another peer!", info);

  // Обрабатываем входящие данные
  connection.on("data", (data) => {
    const message = JSON.parse(data.toString());
    console.log("Received:", message);

    switch (message.type) {
      case "addTask":
        tasks.push({ text: message.task, completed: false });
        renderTasks();
        break;
      case "markTaskAsCompleted":
        markTaskAsCompleted(message.index);
        break;
      case "deleteTask":
        deleteTask(message.index);
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  });
});

// Отображаем начальный экран
renderTasks();
