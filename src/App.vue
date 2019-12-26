<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import meetnow from '../packages/meetnow/src';

export default Vue.extend({
  name : 'app',

  async created() {
    meetnow.setup();

    const ua = meetnow.createUA();
    const conf = await ua.connect({ number: '123456.11111', password: '123456' });
    conf.join();

    setTimeout(() => {
      conf.leave();
    }, 3000);
  },
});
</script>

<style>

</style>
