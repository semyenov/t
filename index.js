import blessed from "blessed";

import NetworkManager from "./lib/network.js";
import Store from "./lib/store.js";
import App from "./lib/app.js";

async function init() {
  const key = process.argv[2];
  if (!key) {
    throw new Error("Usage: node index.js <key>");
  }

  const program = blessed.program({
    smartCSR: true,
    fullUnicode: true,
    autoPadding: true,
    terminal: "xterm-256color",
    log: "./debug.log",
    debug: true,
    // dump: true,
  });
  const screen = blessed.screen({
    program: program,
    useBCE: true,
    title: "Task Manager with Hyperswarm",
    cursor: {
      artificial: true,
      shape: 'underline',
      blink: true,
      color: null
    }
  })

  const network = new NetworkManager(key);
  const store = new Store();
  const app = new App(
    screen,
    network,
    store,
  );

  return app;
}

init()