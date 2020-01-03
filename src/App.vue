<template>
  <div id="app">
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import meetnow from '@meetnow/meetnow/src/index';

console.log(meetnow);

export default Vue.extend({
  name : 'app',

  async created() {
    meetnow.setup();

    const ua = meetnow.createUA();
    // const conf = await ua.connect({ number: '666666.66666' });
    const conf = await ua.connect({ number: '220461.10001' });
    // const conf = await ua.connect({ number: '203798.80002' });
    await conf.join();

    conf.mediaChannel && conf.mediaChannel.connect();
    // conf.share();

    setTimeout(() => {

      // setTimeout(() => {
      //   conf.shareChannel && conf.shareChannel.connect();
      // }, 5000);
    }, 5000);
  },
});
</script>

<style>

</style>
