export default class Notifier {
  constructor() {
    this.listeners = [];
  }

  addListener(listener) {
    this.listeners.push(listener);

    return () => this.removeListener(listener);
  }

  removeListener(listener) {
    const { listeners } = this;

    for (let i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);

        return;
      }
    }
  }

  trigger(...args) {
    this.listeners.slice(0).forEach(listener => listener(...args));
  }
}
