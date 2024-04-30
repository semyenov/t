import { EventEmitter } from "events";
import Hyperswarm from "hyperswarm";
// import b4a from "b4a";

class NetworkManager extends EventEmitter {
  constructor(key) {
    super();

    this.conns = new Set();
    this.swarm = new Hyperswarm();
    this.address = Buffer.from(key, 'base64');
    this.swarm.join(this.address, { announce: true, lookup: true }).flushed(() => this.emit('setStatus', '⏺─ connected '));

    this.swarm.on('connection', this.handleConnection.bind(this));
  }

  handleConnection(conn) {
    // console.log('* got a connection from:', name, '*')
    conn.on('data', message => this.handleMessage(conn, message));
    conn.on('close', () => this.handleClose(conn));
    conn.on('error', error => console.log(`Connection error: ${error}`));

    this.conns.add(conn);
    this.emit('setStatus', statusFormatter(this.conns.size));
  }

  handleMessage(conn, message) {
    const { type, data } = JSON.parse(message);
    this.emit(type, data);
  }

  handleClose(conn) {
    this.conns.delete(conn);
    this.emit('setStatus', statusFormatter(this.conns.size));
  }

  async broadcast(type, data) {
    const message = JSON.stringify({ type, data });
    this.emit('setStatus', statusFormatter(this.conns.size, type));
    for (const conn of this.conns) {
      conn.write(message);
    }
    this.emit('setStatus', statusFormatter(this.conns.size));
  }
}

function statusFormatter(n, msg) {
  let str = '⏺─';
  if (n === 1) return ` ${n} peer ${msg ? `← ${msg} ` : ''}${str}─`;

  str = Array.from({ length: Math.min(8, n) }, () => str).join('');
  return ` ${n} peers ${msg ? `← ${msg} ` : ''}${str}─`
}

export default NetworkManager;