import Vue from 'vue';
import App from './App.vue';

import Iconfont from './components/icon-font.vue';

Vue.config.productionTip = false;

Vue.component('icon-font', Iconfont);

new Vue({
  render : h => h(App),
}).$mount('#app');
