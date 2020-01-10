<template>
  <div id="app">
    <main-content
      :ua="ua"
    ></main-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import meetnow from '@meetnow/meetnow';
import MainContent from './components/main-content.vue';

console.log(meetnow);

export default Vue.extend({
  name : 'app',

  components : {
    MainContent,
  },

  data() {
    return {
      ua : {},
    };
  },

  async created() {
    meetnow.setup();

    const ua = meetnow.createUA();
    this.ua = ua;
    // const conf = await ua.connect({ number: '666666.66666' });
    // const conf = await ua.connect({ number: '220461.10001' });
    // const conf = await ua.connect({ number: '203798.80002' });
    // await conf.join();

    // conf.mediaChannel && await conf.mediaChannel.connect();
    // conf.share();

    // window.conf = conf;

    setTimeout(() => {

      // setTimeout(() => {
      //   conf.shareChannel && conf.shareChannel.connect();
      // }, 5000);
    }, 5000);
  },

  methods : {

  },
});
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
}


</style>
