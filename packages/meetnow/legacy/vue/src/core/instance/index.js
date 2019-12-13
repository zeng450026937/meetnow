import initVue from './init';
import { stateMixin } from './state';
import { eventsMixin } from './events';
import { lifecycleMixin } from './lifecycle';

class Vue {
  constructor(options) {
    this._init(options);
  }
}

Vue.prototype._init = initVue;
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);

export default Vue;
