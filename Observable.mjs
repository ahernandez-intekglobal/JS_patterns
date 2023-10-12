class Observable {
    constructor() {
      this.observers = [];
    }
  
    subscribe(f) {
      this.observers.push(f);
    }
  
    unsubscribe(f) {
      this.observers = this.observers.filter(subscriber => subscriber !== f);
    }
  
    notify(...args) {
      this.observers.forEach(observer => observer(...args));
    }
  }
  
  export default new Observable();