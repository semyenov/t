import App from "./lib/app.js";
import NetworkManager from "./lib/network.js";
import Store from "./lib/store.js";

const key = process.argv[2];
const network = new NetworkManager(key);

const store = new Store();
const app = new App(store, network);
