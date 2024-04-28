import EventEmitter from "events";

class Mediator extends EventEmitter {
   constructor() {
      super();
      this.setMaxListeners(0); // unlimited listeners
   }

   // add an event listener to the mediator
   on(event, listener) {
      super.on(event, listener);
      return this; // chaining
   }

   // emit an event
   emit(event, ...args) {
      super.emit(event, ...args);
      return true; // always return true
   }
};


export default EventEmitter