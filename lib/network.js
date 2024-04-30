import { EventEmitter } from "events";
import Hyperswarm from "hyperswarm";
import b4a from "b4a";

class NetworkManager extends EventEmitter {
  constructor(key) {
    super();

    this.conns = new Set();
    this.swarm = new Hyperswarm();
    this.address = Buffer.from(key, 'base64');
    this.swarm.join(this.address, { announce: true, lookup: true });
    this.swarm.flush().then(() => this.emit('setStatus', '⏺─ connected '));

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

    await Promise.all(
      Array.from(this.conns).map(conn =>
        new Promise((resolve, reject) => {
          conn.write(message, error => {
            if (error) reject(error);
            else resolve();
          });
        })
      )
    ).then(() => {
      this.emit('setStatus', statusFormatter(this.conns.size));
      return this.swarm.flush()
    });
  }
}

function statusFormatter(n, msg) {
  let str = '⏺─';
  if (n === 1) return `${str}─ ${n} peer ${msg ? `← ${msg} ` : ''}`;

  str = Array.from({ length: Math.min(5, n) }, () => str).join('');
  return `${str}─ ${n} peers ${msg ? `← ${msg} ` : ''}`
}

export default NetworkManager;