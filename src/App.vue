<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import meetnow from '@meetnow/meetnow';

console.log(meetnow);

export default Vue.extend({
  name : 'app',

  async created() {
    meetnow.setup();

    const ua = meetnow.createUA();
    const conf = await ua.connect({ number: '666666.66666' });
    conf.join();

    setTimeout(() => {
      // conf.share();
      // conf.mediaChannel && conf.mediaChannel.connect();

      // setTimeout(() => {
      //   conf.shareChannel && conf.shareChannel.connect();
      // }, 5000);
    }, 5000);
  },
});
</script>

<style>

</style>
