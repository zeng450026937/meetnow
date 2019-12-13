import Session from '../service/session/Session';

class SessionProvider {
  static instance = new Map();

  static getInstance(name = 'default') {
    if (!this.instance.get(name)) this.instance.set(name, new Session(name));

    return this.instance.get(name);
  }
}
