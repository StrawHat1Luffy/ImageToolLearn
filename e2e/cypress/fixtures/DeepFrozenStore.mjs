import deepFreeze from 'deep-freeze'

class DeepFrozenStore {
  state = {};
  callbacks = [];

  getState = () => this.state;

  setState = (patch) => {
    const nextState = deepFreeze({ ...this.state, ...patch });
    this._publish(this.state, nextState, patch);
    this.state = nextState;
  };

  subscribe = (listener) => {
    this.callbacks.push(listener);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== listener);
    };
  };

  _publish = (prevState, nextState, patch) => {
    this.callbacks.forEach(listener => listener(prevState, nextState, patch));
  };
}

export default function defaultStore() {
  return new DeepFrozenStore();
}
